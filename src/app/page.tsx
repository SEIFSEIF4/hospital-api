"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const apiMaxNumOfRequests = 50;

export default function Home() {
  const { theme, setTheme } = useTheme();
  const storedRequestCount = localStorage.getItem("requestCount");
  const initialRequestCount = storedRequestCount
    ? parseInt(storedRequestCount)
    : apiMaxNumOfRequests;
  const [requestCount, setRequestCount] = useState(initialRequestCount);
  const [input, setInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
    MaxNumOfRequests: number;
  }>();

  useEffect(() => {
    localStorage.setItem("requestCount", requestCount.toString());
  }, [requestCount]);

  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setSearchResults(undefined);
      // the prefix to test  this on cloudflare worker url is
      // https://hospitalapi.onealking151.workers.dev/api/search?q=<input>

      setRequestCount(requestCount - 1);
      if (requestCount <= 1) return;
      console.log("requestCount", requestCount);

      const res = await fetch(`/api/search?q=${input}`);
      const data = (await res.json()) as {
        results: string[];
        duration: number;
        MaxNumOfRequests: number;
      };
      setSearchResults(data);
    };

    fetchData();
  }, [input]);

  return (
    <main
      className={`h-screen w-screen select-none ${
        theme === "light" ? "grainy" : ""
      }`}
    >
      <div className="flex flex-col gap-6 items-center pt-32  duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <p className="text-primary-500 text-sm font-bold">v1.0.0</p>
        <h1
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-5xl cursor-pointer tracking-tight text-primary font-bold"
        >
          Hospital API ⚡
        </h1>
        <p className="text-primary-600 text-xs md:text-lg lg:text-xl  max-w-prose  text-center">
          This an App built with a REST API. The API is served by a serverless
          function.
        </p>
        <div className="max-w-md w-full">
          <Command>
            <CommandInput
              value={input}
              disabled={requestCount === 0}
              onValueChange={setInput}
              placeholder="Search countries..."
              className="placeholder:text-primary-500"
            />
            <CommandList>
              {searchResults?.results?.length === 0 ? (
                <CommandEmpty>No results found.</CommandEmpty>
              ) : null}

              {searchResults?.results ? (
                <CommandGroup heading="Results">
                  {searchResults?.results.map((result) => (
                    <CommandItem
                      key={result}
                      value={result}
                      onSelect={setInput}
                    >
                      {result}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ) : null}

              {searchResults?.results ? (
                <>
                  <div className="h-px w-full bg-primary-200" />
                  <div className="flex justify-between">
                    <p className="p-2 text-xs text-primary-500">
                      Found {searchResults.results.length} results in{" "}
                      {searchResults?.duration.toFixed(0)}ms
                    </p>
                    <p className="p-2 text-xs text-primary-500">
                      {apiMaxNumOfRequests - requestCount} API requests{" "}
                      <span className="text-red-500">{requestCount}</span>{" "}
                      remaining
                    </p>
                  </div>
                </>
              ) : null}
            </CommandList>
          </Command>
        </div>
      </div>
    </main>
  );
}
