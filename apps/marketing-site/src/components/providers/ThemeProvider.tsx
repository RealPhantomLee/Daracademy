"use client";

import { ReactNode, useEffect, useState } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Determine theme based on hour of day
    const hour = new Date().getHours();
    const theme = hour >= 20 || hour < 7 ? "night" : "day";

    // Apply theme to HTML element
    document.documentElement.setAttribute("data-theme", theme);

    // Persist to localStorage
    localStorage.setItem("theme-preference", theme);

    setMounted(true);
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

export function useTheme() {
  const [theme, setTheme] = useState<"day" | "night">("day");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme-preference");
    const hour = new Date().getHours();
    const currentTheme =
      (storedTheme as "day" | "night" | null) ||
      (hour >= 20 || hour < 7 ? "night" : "day");

    setTheme(currentTheme);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "day" ? "night" : "day";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme-preference", newTheme);
  };

  return { theme, toggleTheme, mounted };
}
