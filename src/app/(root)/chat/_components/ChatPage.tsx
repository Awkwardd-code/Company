"use client";

import { useState, useEffect, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";
import StaticMessageContainer from "@/components/Widgets/StaticMessageContainer";
import MessageContainer from "@/components/Widgets/message-container";
import DummyMessageInput from "@/components/Widgets/DummyMessageInput";
import MessageInput from "@/components/Widgets/message-input";

// Types
interface User {
  _id: Id<"users">;
  name?: string;
  image?: string;
}

interface Conversation {
  participants: Id<"users">[];
}

const ChatPage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [hasConversation, setHasConversation] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
      return conversation.participants.find((id) => id !== me._id) || null;
    }
    return null;
  }, [conversation, me]);

  const otherUser = useQuery(
    api.users.getUserById,
    hasConversation && otherUserId ? { userId: otherUserId } : "skip"
  ) as User | undefined | "skip";

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

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

  if (!isLoaded || conversation === undefined || me === undefined) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <div className="animate-pulse text-blue-600">Loading chat...</div>
      </div>
    );
  }

  if (conversation === null || me === null) {
    return (
      <div className="flex justify-center items-center h-screen w-full bg-red-100">
        Error loading chat data
      </div>
    );
  }

  return (
    <div
      className="flex flex-col w-full mx-auto bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
      style={{
        minHeight: isMobile
          ? "calc(100vh - 95px - 85px - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
          : "calc(100vh - 95px - env(safe-area-inset-top))",
        maxHeight: isMobile
          ? "calc(100vh - 95px - 85px - env(safe-area-inset-top) - env(safe-area-inset-bottom))"
          : "calc(100vh - 95px - env(safe-area-inset-top))",
      }}
    >
      {/* Header (inside ChatPage) */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800">
        <div className="flex gap-3 items-center overflow-hidden">
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
          <div className="flex flex-col truncate">
            <p className="font-medium text-sm sm:text-base truncate">
              {conversationName}
            </p>
          </div>
        </div>
      </div>

      {/* Chat content scrollable */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-2 sm:py-4">
        {!user ? (
          <StaticMessageContainer />
        ) : !hasConversation ? (
          <MessageContainer />
        ) : (
          <MessageContainer />
        )}
      </div>

      {/* Message input */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 sm:px-4 py-2 sm:py-3">
        {!user || !hasConversation ? (
          <DummyMessageInput />
        ) : (
          <MessageInput />
        )}
      </div>
    </div>
  );
};

export default ChatPage;