"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav
      className={
        "w-full flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-transparent backdrop-blur-none z-40 sticky top-0"
      }
    >
      <div className="flex items-center">
        <Link href="/" className="font-bold text-xl tracking-tight text-white drop-shadow-lg hover:underline focus:outline-none">
          Notion Todo
        </Link>
      </div>
      <div className="flex items-center">
        <a
          href="/pomodoro"
          className="text-white drop-shadow-lg hover:underline ml-2"
        >
          Pomodoro
        </a>
      </div>
    </nav>
  );
}
