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
import { redirect, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const apiMaxNumOfRequests = 50;

export default function Home() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [requestCount, setRequestCount] = useState(apiMaxNumOfRequests);
  const [input, setInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
    MaxNumOfRequests: number;
  }>();

  useEffect(() => {
    const storedRequestCount =
      typeof window !== "undefined"
        ? localStorage.getItem("requestCount")
        : null;
    const initialRequestCount = storedRequestCount
      ? parseInt(storedRequestCount)
      : apiMaxNumOfRequests;
    setRequestCount(initialRequestCount);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("requestCount", requestCount.toString());
    }
  }, [requestCount]);

  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setSearchResults(undefined);
      // the prefix to test  this on cloudflare worker url is
      // https://hospitalapi.<username>.workers.dev/api/search?q=<input>

      setRequestCount(requestCount - 1);
      if (requestCount <= 1) return;
      console.log("requestCount", requestCount);

      try {
        const res = await fetch(`/api/search?q=${input}`);
        const data = (await res.json()) as {
          results: string[];
          duration: number;
          MaxNumOfRequests: number;
        };
        setSearchResults(data);
      } catch (e) {
        console.log("errads");
      }
    };

    fetchData();
  }, [input]);

  const handleSelect = (value: string) => {
    setInput(value);
    toast.success(`Selected ${value}`);
    router.push(`api/hospital?hospitalName=${value}`);
  };

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
          className="text-xl md:text-5xl sm:text-3xl cursor-pointer tracking-tight text-primary font-bold"
        >
          Hospital API ⚡
        </h1>
        <p className="text-primary-600  text-[8px] sm:text-base md:text-lg lg:text-xl  max-w-prose  text-center">
          This an App built with a REST API. The API is served by a serverless
          function.
        </p>
        <div className="max-w-md w-full">
          <Command>
            <CommandInput
              value={input}
              disabled={requestCount === 0}
              onValueChange={setInput}
              placeholder="Search hospitals..."
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
                      onSelect={handleSelect}
                    >
                      {result
                        .toLowerCase()
                        .split(" ")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
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
