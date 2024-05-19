"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { RiSearch2Line } from "react-icons/ri";

export default function Search({ disabled }: { disabled?: boolean }) {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [_, startTransition] = useTransition();

  function handleSearch(term: string) {
    const params = new URLSearchParams(window.location.search);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative max-w-md">
      <label htmlFor="search" className="sr-only">
        Cari
      </label>
      <div className="rounded-md shadow-sm">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
          aria-hidden="true"
        >
          <RiSearch2Line
            className="mr-3 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <input
          type="text"
          name="search"
          id="search"
          disabled={disabled}
          className="h-7 block w-full text-xs rounded-md border border-gray-200 pl-9 pr-1 focus:outline-none"
          placeholder="Cari"
          spellCheck={false}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );
}
