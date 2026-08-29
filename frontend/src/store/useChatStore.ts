import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import type { chatStoreType, User } from "../types/types";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create<chatStoreType>()(
  persist(
    (set, get) => ({
      users: [],
      conversations: [],
      messages: [],
      selectedUser: null,
      isConversationsLoading: false,
      isMessagesLoading: false,
      activeConversationId: null,
      searchQuery: "",
      sidebarTab: "chats",
      composerText: "",
      isSoundEnabled: true,
      isSendingMedia: false,
      isUsersLoading: false,
      getUsers: async () => {
        set({ isUsersLoading: true });
        try {
          const res = await axiosInstance.get("/messages/users");
          set((state) => {
            const selectedUser = state.selectedUser;

            const isSelectedUserStillAvailable =
              selectedUser &&
              res.data.some((user: User) => user._id === selectedUser._id);

            return {
              users: res.data,
              selectedUser: isSelectedUserStillAvailable ? selectedUser : null,
            };
          });
        } catch (error) {
          if (error instanceof Error)
            console.log("Error in get Users", error.message);
        } finally {
          set({ isUsersLoading: false });
        }
      },

      getConversations: async () => {
        set({ isConversationsLoading: true });
        try {
          const res = await axiosInstance.get("/messages/conversations");
          set({ conversations: res.data });
        } catch (error) {
          if (error instanceof Error)
            console.log("Error in getConversations", error.message);
        } finally {
          set({ isConversationsLoading: false });
        }
      },

      getMessages: async (userId: string) => {
        if (!userId) return;
        set({ isMessagesLoading: true });
        try {
          const res = await axiosInstance.get(`/messages/${userId}`);
          set({ messages: res.data });
        } catch (error) {
          if (error instanceof AxiosError)
            toast.error(
              error.response?.data?.message || "Failed to load messages",
            );
        } finally {
          set({ isMessagesLoading: false });
        }
      },

      sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        if (!selectedUser) return false;

        try {
          const res = await axiosInstance.post(
            `/messages/send/${selectedUser._id}`,
            messageData,
          );
          set({ messages: [...messages, res.data], composerText: "" });
          get().getConversations();
          return true;
        } catch (error) {
          if (error instanceof AxiosError) {
            toast.error(
              error.response?.data?.message || "Failed to send message",
            );
          } else {
            toast.error("Failed to send message");
          }

          return false;
        }
      },

      subscribeToMessages: (userId: string) => {
        if (!userId) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newMessage");
        socket.on("newMessage", (newMessage) => {
          // if im not the receiver don't do anything just return
          if (String(newMessage.senderId) !== String(userId)) return;

          set({ messages: [...get().messages, newMessage] });

          get().getConversations();
        });
      },

      unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
      },

      setSelectedUser: (selectedUser: User) => set({ selectedUser }),

      setActiveConversationId: (activeConversationId: string | null) => {
        set((state) => ({
          activeConversationId,
          selectedUser:
            state.users.find((user) => user._id === activeConversationId) ||
            state.conversations.find(
              (user: User) => user._id === activeConversationId,
            ) ||
            null,
          messages: activeConversationId ? state.messages : [],
        }));
      },

      setSearchQuery: (searchQuery: string) => set({ searchQuery }),
      setSidebarTab: (sidebarTab: string) => set({ sidebarTab }),
      setComposerText: (composerText: string) => set({ composerText }),
      setSoundEnabled: (isSoundEnabled: boolean) => set({ isSoundEnabled }),

      sendTextMessage: async (conversationId: string) => {
        const messageText = get().composerText.trim();
        if (!conversationId || !messageText) return false;

        return get().sendMessage({ text: messageText });
      },
      sendMediaMessage: async ({ conversationId, file }) => {
        if (!conversationId || !file) return false;

        const formData = new FormData();
        formData.append("media", file);

        set({ isSendingMedia: true });
        try {
          return await get().sendMessage(formData);
        } finally {
          set({ isSendingMedia: false });
        }
      },
    }),
    {
      name: "imessage-storage",
      partialize: (state) => ({ isSoundEnabled: state.isSoundEnabled }),
    },
  ),
);
