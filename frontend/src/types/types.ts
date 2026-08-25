import type { Dispatch, SetStateAction } from "react";

export type herouiThemePresetsType = {
  id: string;
  label: string;
  swatch: string;
}[];

export type wallpaperType = {
  id: string;
  category: string;
  label: string;
  url: string;
};

export type wallpapersType = wallpaperType[];
export type wallpaperSectionsType = {
  id: string;
  title: string;
}[];

export type Theme = "light" | "dark";

export type ThemeContextType = {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  toggleTheme: () => void;
  themePreset: string;
  setThemePreset: Dispatch<SetStateAction<string>>;
};

export type WallpaperContextType = {
  wallpaperId: string;
  setWallpaperId: (id: string) => void;
  wallpaper: wallpaperType;
  frameStyle: {
    backgroundImage: string;
    backgroundSize: string;
    backgroundPosition: string;
  };
};
