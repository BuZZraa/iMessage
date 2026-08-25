import { createContext, useContext } from "react";
import type { WallpaperContextType } from "../types/types";

export const WallpaperContext = createContext<WallpaperContextType | null>(
  null,
);

export function useWallpaper() {
  const ctx = useContext(WallpaperContext);

  if (!ctx) {
    throw new Error("useWallpaper must be used within WallpaperProvider");
  }
  return ctx;
}
