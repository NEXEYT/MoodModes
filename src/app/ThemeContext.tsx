"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { spyTheme } from "../themes/spy";
import { scifiTheme } from "../themes/scifi";
import { arcadeTheme } from "../themes/arcade";


// Ensure themes are always the correct type
export const themes: ThemeType[] = [
  spyTheme,
  scifiTheme,
  arcadeTheme,
];

export type ThemeType = {
  name: string;
  background: string;
  fontClass: string;
  soundEffects: Record<string, unknown>; // Avoid 'any' for type safety
  animationVariants: Record<string, unknown>;
  backgroundImage?: string; // Add this property for theme imagery
};


export interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  allThemes: ThemeType[];
}


// Expose a hook for switching theme by name (for ThemeSwitcher)
export function useThemeSwitcher() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeSwitcher must be used within ThemeProvider");
  const { setTheme, allThemes } = ctx;
  const setThemeByName = (name: string) => {
    const found = allThemes.find((t) => t.name === name);
    if (found) setTheme(found);
  };
  return { setThemeByName, allThemes };
}


const ThemeContext = createContext<ThemeContextType | undefined>(undefined);


export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // SSR-safe: Only access localStorage in useEffect
  const [theme, setThemeState] = useState<ThemeType>(spyTheme);

  useEffect(() => {
    // On mount, check localStorage for theme
    const stored = typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    if (stored) {
      const found = themes.find((t) => t.name === stored);
      if (found) setThemeState(found);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme.name);
    }
  }, [theme]);

  const setTheme = (t: ThemeType) => setThemeState(t);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, allThemes: themes }}>
      {children}
    </ThemeContext.Provider>
  );
}


export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
