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
import { Button } from "@/components/ui/button";

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
      // https://hospitalapi.bloodbridge.workers.dev/api/search?q=<input>

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
    <main className="h-screen w-screen grainy select-none">
      <div className="flex flex-col gap-6 items-center pt-32 duration-500 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
        <p className="text-zinc-500 text-sm font-bold">v1.0.0</p>
        <h1 className="text-5xl tracking-tight font-bold">Hospital API ⚡</h1>
        <Button
          variant="link"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          Toggle Theme
        </Button>
        <p className="text-zinc-600 text-lg max-w-prose text-center">
          This is a Next.js app with a REST API. The API is served by a
          serverless function.
        </p>

        <div className="max-w-md w-full">
          <Command>
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder="Search countries..."
              className="placeholder:text-zinc-500"
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
                  <div className="h-px w-full bg-zinc-200" />

                  <p className="p-2 text-xs text-zinc-500">
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
