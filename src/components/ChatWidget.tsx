"use client";

import { useState, useEffect, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import MessageContainer from "./Widgets/message-container";
import MessageInput from "./Widgets/message-input";
import DummyMessageInput from "./Widgets/DummyMessageInput";
import StaticMessageContainer from "./Widgets/StaticMessageContainer";

// Types
interface User {
  _id: Id<"users">;
  name?: string;
  image?: string;
}

interface Conversation {
  participants: Id<"users">[];
}

interface ChatPanelProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  conversationName: string;
  conversationImage: string;
  children: React.ReactNode;
}

interface ChatToggleButtonProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ChatWidget: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [hasConversation, setHasConversation] = useState(false);

  const conversation = useQuery(
    api.conversations.getUserConversation,
    user ? {} : "skip"
  ) as Conversation | undefined | "skip";

  const me = useQuery(api.users.getMe, user ? {} : "skip") as
    | User
    | undefined
    | "skip";

  const otherUserId = useMemo(() => {
    if (
      conversation &&
      typeof conversation !== "string" &&
      Array.isArray(conversation.participants) &&
      me &&
      typeof me !== "string"
    ) {
      const typedMe = me as User;
      return conversation.participants.find((id) => id !== typedMe._id) || null;
    }
    return null;
  }, [conversation, me]);

  const otherUser = useQuery(
    api.users.getUserById,
    hasConversation && otherUserId ? { userId: otherUserId } : "skip"
  ) as User | undefined | "skip";

  useEffect(() => {
    if (
      conversation &&
      typeof conversation !== "string" &&
      conversation.participants?.length > 0
    ) {
      setHasConversation(true);
    } else {
      setHasConversation(false);
    }
  }, [conversation]);

  const conversationName = useMemo(
    () =>
      user
        ? hasConversation && otherUser && typeof otherUser !== "string"
          ? otherUser.name
          : "Conversation"
        : "Guest",
    [user, otherUser, hasConversation]
  );

  const conversationImage = useMemo(
    () =>
      user
        ? hasConversation && otherUser && typeof otherUser !== "string"
          ? otherUser.image
          : "/placeholder.png"
        : "/placeholder.png",
    [user, otherUser, hasConversation]
  );

  // ✅ Auto-close chat if screen size becomes mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isLoaded || conversation === undefined || me === undefined) {
    return (
      <div className="fixed bottom-5 right-5 z-[1000] animate-pulse hidden md:block">
        <div className="bg-blue-600 text-white p-4 rounded-full shadow-lg">
          <MessageSquare className="w-6 h-6" />
        </div>
      </div>
    );
  }

  if (conversation === null || me === null) {
    return (
      <div className="fixed bottom-5 right-5 z-[1000] bg-red-100 p-4 rounded-lg hidden md:block">
        Error loading chat data
      </div>
    );
  }

  return (
    <>
      <ChatToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
      <ChatPanel
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        conversationName={conversationName || "Conversation"}
        conversationImage={conversationImage || "/placeholder.png"}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {!user ? (
              <StaticMessageContainer />
            ) : !hasConversation ? (
              <MessageContainer />
            ) : (
              <MessageContainer />
            )}
          </div>
          <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            {!user || !hasConversation ? <DummyMessageInput /> : <MessageInput />}
          </div>
        </div>
      </ChatPanel>
    </>
  );
};

const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 768) {
      setIsOpen(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-[1000] transition-all duration-300 ease-in-out ${isOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"
        } hidden md:block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      aria-label="Toggle chat widget"
      aria-expanded={isOpen}
      aria-controls="chat-panel"
    >
      <MessageSquare className="w-6 h-6" aria-hidden="true" />
    </button>
  );
};



const ChatPanel: React.FC<ChatPanelProps> = ({
  isOpen,
  setIsOpen,
  conversationName,
  conversationImage,
  children,
}) => (
  <div
    className={`fixed bottom-5 right-5 md:right-16 z-[999] transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-xl border rounded-xl flex flex-col overflow-hidden
      ${isOpen
        ? "h-[90vh] w-[95vw] sm:w-[80vw] md:w-[50vw] lg:w-[40vw] opacity-100"
        : "h-0 w-0 opacity-0"
      }`}
    style={{
      top: isOpen ? "5vh" : "auto",
      visibility: isOpen ? "visible" : "hidden",
    }}
    id="chat-panel"
    role="dialog"
    aria-label="Chat window"
  >
    <div className="sticky top-0 z-[500] bg-gray-100 dark:bg-gray-700 h-[10%] min-h-[48px]">
      <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-600 h-full">
        <div className="flex gap-3 items-center">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={conversationImage}
              className="object-cover"
              alt={`${conversationName}'s avatar`}
            />
            <AvatarFallback>
              <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="font-medium">{conversationName}</p>
          </div>
        </div>
        <button
          className="flex items-center gap-5"
          onClick={() => setIsOpen(false)}
          aria-label="Close chat window"
        >
          <X
            size={18}
            className="cursor-pointer text-gray-900 dark:text-gray-100 hover:text-red-500 transition"
          />
        </button>
      </div>
    </div>
    {children}
  </div>
);

export default ChatWidget;
