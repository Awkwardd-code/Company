import { Id } from "../../convex/_generated/dataModel";
import { create } from "zustand";

export type Conversation = {
  _id: Id<"conversations">;
  image?: string;
  participants: Id<"users">[];
  isGroup: boolean;
  name?: string;
  groupImage?: string;
  groupName?: string;
  admin?: Id<"users">;
  isOnline?: boolean;
  lastMessage?: {
    _id: Id<"messages">;
    conversation: Id<"conversations">;
    content: string;
    sender: Id<"users">; // Ensure sender is Id<"users">
  };
};

type ConversationStore = {
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
  selectedConversation: null,
  setSelectedConversation: (conversation) => set({ selectedConversation: conversation }),
}));

export type IMessage = {
  _id: Id<"messages">;
  _creationTime: number;
  conversation: Id<"conversations">;
  content: string;
  sender: { 
    _id: Id<"users">;
    image?: string;
    name?: string;
    email: string;
    tokenIdentifier: string;
    isOnline: boolean;
    _creationTime: number;
    isAdmin?: boolean;
    role?: "client" | "user" | "programmer";
  };
  messageType: "image" | "text" | "video";
};
