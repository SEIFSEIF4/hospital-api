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

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [input, setInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{
    results: string[];
    duration: number;
  }>();

  useEffect(() => {
    const fetchData = async () => {
      if (!input) return setSearchResults(undefined);
      // the prefix to test  this on cloudflare worker url is
      // // https://hospitalapi.onealking151.workers.dev/api/search?q=<input>

      const res = await fetch(`/api/search?q=${input}`);
      const data = (await res.json()) as {
        results: string[];
        duration: number;
      };
      setSearchResults(data);
    };

    fetchData();
  }, [input]);

  return (
    <main
      className={`h-screen  w-screen select-none ${
        theme === "dark" ? "" : "grainy"
      }`}
    >
      <div className="flex flex-col gap-6 items-center pt-32 .grainy-content  duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <p className="text-zinc-500 text-sm font-bold">v1.0.0</p>
        <h1
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-5xl cursor-pointer tracking-tight text-primary font-bold"
        >
          Hospital API ⚡
        </h1>
        <p className="text-primary-600 text-xs md:text-lg lg:text-xl  max-w-prose  text-center">
          This an app with a REST API. The API is served by a serverless
          function.
        </p>
        <div className="max-w-md w-full">
          <Command>
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder="Search countries..."
              className="placeholder:text-primary-500"
            />
            <CommandList>
              {searchResults?.results.length === 0 ? (
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

                  <p className="p-2 text-xs text-primary-500">
                    Found {searchResults.results.length} results in{" "}
                    {searchResults?.duration.toFixed(0)}ms
                  </p>
                </>
              ) : null}
            </CommandList>
          </Command>
        </div>
      </div>
    </main>
  );
}
