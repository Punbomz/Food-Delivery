"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function NavbarSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(
    searchParams.get("srch") ?? ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) params.set("srch", value);
    else params.delete("srch");

    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="hidden lg:flex">
      <label className="input items-center gap-2 flex-none">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeWidth="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </g>
        </svg>

        <input
          type="search"
          placeholder="Search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button type="submit" className="hidden lg:flex items-center hover:cursor-pointer"><i className="fa">&#xf002;</i></button>
      </label>
    </form>
  );
}
