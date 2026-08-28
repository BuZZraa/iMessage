import type { Dispatch, SetStateAction } from "react";
import type { Socket } from "socket.io-client";

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

export type WallpaperThumbType = {
  wallpaper: wallpaperType;
  selected: boolean;
  onSelect: (id: string) => void;
};

export type User = {
  _id: string;
  clerkId: string;
  email: string;
  fullName: string;
  profilePic?: string;
};

export type authStoreType = {
  authUser: string | null;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;
  checkAuth: () => Promise<void>;
  connectSocket: (user: User) => void;
  disconnectSocket: () => void;
  clearAuth: () => void;
};

export type chatStoreType = {
  users: User[];
  conversations: [];
  messages: [];
  selectedUser: User | null;
  isConversationsLoading: boolean;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  activeConversationId: null;
  searchQuery: string;
  sidebarTab: "chats" | "users";
  composerText: string;
  isSoundEnabled: boolean;
  isSendingMedia: boolean;
  getUsers: () => Promise<void>;
  getConversations: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  
};
