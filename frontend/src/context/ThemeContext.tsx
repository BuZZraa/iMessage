import {
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
  type SetStateAction,
} from "react";
import { DEFAULT_THEME_PRESET_ID } from "../data/herouiThemePresets";
import {
  applyThemePresetToDocument,
  isValidThemePreset,
  ThemeContext,
} from "./theme";
import type { Theme } from "../types/types";

function getSystemTheme() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function readStoredTheme() {
  const theme = localStorage.getItem("theme");
  if (theme === "light" || theme === "dark") return theme;

  return null;
}

function applyDomTheme(theme: string) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
}

function readStoredThemePreset() {
  const themePreset = localStorage.getItem("theme-preset");
  if (themePreset && isValidThemePreset(themePreset)) return themePreset;

  return DEFAULT_THEME_PRESET_ID;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () => readStoredTheme() ?? getSystemTheme(),
  );
  const [themePreset, setThemePresetState] = useState(readStoredThemePreset);

  // this applies light/dark mode
  useLayoutEffect(() => {
    applyDomTheme(theme);
  }, [theme]);

  // this applies the theme preset, like sky, spotify, etc.
  useLayoutEffect(() => {
    applyThemePresetToDocument(themePreset);
  }, [themePreset]);

  // this stores the theme and theme preset in local storage
  useEffect(() => {
    localStorage.setItem("theme", theme);
    localStorage.setItem("theme-preset", themePreset);
  }, [theme, themePreset]);

  const setTheme = (next: SetStateAction<Theme>) => {
    setThemeState(next);
  };
  const toggleTheme = () => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  };

  const setThemePreset = (next: SetStateAction<string>) => {
    setThemePresetState((prev) => {
      const resolved = typeof next === "function" ? next(prev) : next;
      return isValidThemePreset(resolved) ? resolved : DEFAULT_THEME_PRESET_ID;
    });
  };

  const value = { theme, setTheme, toggleTheme, themePreset, setThemePreset };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
