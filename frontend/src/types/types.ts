import type { Dispatch, ReactNode, SetStateAction } from "react";
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
  messages: messageType[];
  selectedUser: User | null;
  isConversationsLoading: boolean;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  activeConversationId: string | null;
  searchQuery: string;
  sidebarTab: string;
  composerText: string;
  isSoundEnabled: boolean;
  isSendingMedia: boolean;
  getUsers: () => Promise<void>;
  getConversations: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  subscribeToMessages: (userId: string) => void;
  unsubscribeFromMessages: () => void;
  setActiveConversationId: (activeConversationId: string | null) => void;
  setSoundEnabled: (isSoundEnabled: boolean) => void;
  setSidebarTab: (sidebarTab: string) => void;
  setComposerText: (composerText: string) => void;
  setSearchQuery: (searchQuery: string) => void;
  sendMessage: (messageData: OutgoingMessagePayload) => Promise<boolean>;
  sendTextMessage: (conversationId: string) => Promise<boolean>;
  sendMediaMessage: ({
    conversationId,
    file,
  }: {
    conversationId: string;
    file: File;
  }) => Promise<boolean>;
};

export type AvatarWithOnlineIndicatorType = {
  isOnline: boolean;
  children: ReactNode;
  dotClassName?: string;
};

export type ConversationRowType = {
  user: {
    name: string;
    avatarUrl: string | undefined;
    initials: string;
    isOnline: boolean;
  };
  selected: boolean;
  onSelect: () => void;
};

export type messageType = {
  id: string;
  imageUrl?: string;
  videoUrl?: string;
  text?: string;
  time: string;
  role: string;
};

export type OutgoingMessagePayload = { text: string } | FormData;