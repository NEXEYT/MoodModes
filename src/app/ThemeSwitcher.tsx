"use client";
import React from "react";
import { useTheme } from "./ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme, allThemes } = useTheme();

  return (
    <div className="fixed bottom-8 right-8 z-50 bg-black/80 rounded-lg p-5 flex flex-col gap-2 shadow-lg border border-neutral-800">
      <label htmlFor="theme-select" className="text-xs text-neutral-400 mb-1">
        Theme
      </label>
      <select
        id="theme-select"
        value={theme.name}
        onChange={(e) => {
          const selected = allThemes.find(
            (t) => t.name === e.target.value
          );
          if (selected) setTheme(selected);
        }}
        className="px-3 py-2 rounded font-semibold text-sm bg-neutral-900 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        aria-label="Select theme"
      >
        {allThemes.map((t) => (
          <option key={t.name} value={t.name}>
            {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}
