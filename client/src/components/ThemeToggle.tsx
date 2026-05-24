"use client";

import React from "react";
import { SunMoon } from "lucide-react";

type ThemeMode = "light" | "dark" | "system";

const THEME_STORAGE_KEY = "vedax-theme-mode";

const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const setTheme = (theme: "light" | "dark") => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  const handleToggle = () => {
    if (typeof window === "undefined") {
      return;
    }

    const storedMode = window.localStorage.getItem(THEME_STORAGE_KEY);
    const activeTheme =
      storedMode === "light" || storedMode === "dark"
        ? storedMode
        : document.documentElement.getAttribute("data-theme") === "dark" || getSystemTheme() === "dark"
          ? "dark"
          : "light";

    setTheme(activeTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label="Toggle day and night mode"
      title="Toggle day and night mode"
      className={`inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/80 px-3 py-2 text-primary shadow-sm backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-md active:scale-95 ${
        compact ? "h-10 w-10 justify-center px-0" : "h-10"
      }`}
    >
      <SunMoon className="h-4 w-4" />
      {!compact && <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]">Day / Night</span>}
    </button>
  );
}