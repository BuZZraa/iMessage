import { createContext, useContext } from "react";
import {
  DEFAULT_THEME_PRESET_ID,
  HERO_UI_THEME_PRESETS,
} from "../data/herouiThemePresets";
import type { ThemeContextType } from "../types/types";

export const ThemeContext = createContext<ThemeContextType | null>(null);

const PRESET_IDS = new Set(HERO_UI_THEME_PRESETS.map((p) => p.id));

export function isValidThemePreset(presetId: string) {
  return PRESET_IDS.has(presetId);
}

/** apply preset to `<html>` immediately so `--accent` updates before paint. */
export function applyThemePresetToDocument(presetId: string) {
  const id = isValidThemePreset(presetId) ? presetId : DEFAULT_THEME_PRESET_ID;
  document.documentElement.setAttribute("data-theme-preset", id);
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
