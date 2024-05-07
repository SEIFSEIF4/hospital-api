import { Redis } from "@upstash/redis/cloudflare";
import { Context, Hono } from "hono";
import { env } from "hono/adapter";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import { Ratelimit } from "@upstash/ratelimit";
import { BlankInput, Env } from "hono/types";

declare module "hono" {
  interface ContextVariableMap {
    ratelimit: Ratelimit;
  }
}

let RateLimitDuration = 1800;
let MaxNumOfRequests = 50;

export const runtime = "edge";
const app = new Hono().basePath("/api");
const cache = new Map();

class RateLimiter {
  static instances: Ratelimit;

  static getInstance(c: Context<Env, any, BlankInput>) {
    if (!this.instances) {
      const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
        env<EnvConfig>(c);

      const redisClient = new Redis({
        token: UPSTASH_REDIS_REST_TOKEN,
        url: UPSTASH_REDIS_REST_URL,
      });

      const ratelimit = new Ratelimit({
        redis: redisClient,
        limiter: Ratelimit.slidingWindow(
          MaxNumOfRequests,
          `${RateLimitDuration} s`
        ),
        ephemeralCache: cache,
      });

      this.instances = ratelimit;
      return this.instances;
    } else {
      return this.instances;
    }
  }
}

type EnvConfig = {
  UPSTASH_REDIS_REST_TOKEN: string;
  UPSTASH_REDIS_REST_URL: string;
};

app.use("/*", cors());

app.use(async (c, next) => {
  const ratelimit = RateLimiter.getInstance(c);
  c.set("ratelimit", ratelimit);
  await next();
});

app.get("/search", async (c) => {
  const ratelimit = c.get("ratelimit");
  const ip = c.req.raw.headers.get("CF-Connecting-IP");

  const { success } = await ratelimit.limit(ip ?? "anonymous");

  if (success) {
    try {
      const { UPSTASH_REDIS_REST_TOKEN, UPSTASH_REDIS_REST_URL } =
        env<EnvConfig>(c);

      const start = performance.now();
      // ---------------------

      const redis = new Redis({
        token: UPSTASH_REDIS_REST_TOKEN,
        url: UPSTASH_REDIS_REST_URL,
      });

      const query = c.req.query("q")?.toUpperCase();

      if (!query) {
        return c.json({ message: "Invalid search query" }, { status: 400 });
      }

      const res = [];
      const rank = await redis.zrank("hospitals", query);

      if (rank !== null && rank !== undefined) {
        const temp = await redis.zrange<string[]>(
          "hospitals",
          rank,
          rank + 100
        );

        for (const el of temp) {
          if (!el.startsWith(query)) {
            break;
          }

          if (el.endsWith("*")) {
            res.push(el.substring(0, el.length - 1));
          }
        }
      }

      // ------------------------
      const end = performance.now();

      return c.json({
        results: res,
        duration: end - start,
        MaxNumOfRequests: MaxNumOfRequests,
        RateLimitDuration: RateLimitDuration,
      });
    } catch (err) {
      console.error(err);

      return c.json(
        { results: [], message: "Something went wrong." },
        {
          status: 500,
        }
      );
    }
  } else {
    return c.json(
      { message: "Rate limit exceeded. Try again after some time." },
      { status: 429 }
    );
  }
});

export const GET = handle(app);
export default app as never;
