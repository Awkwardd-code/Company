import ChatBubble from "./chat-bubble";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef } from "react";
import LoaderUI from "../LoaderUI";
import type { Id } from "../../../convex/_generated/dataModel";

interface User {
  _id: Id<"users">;
  name?: string;
  email: string;
  isAdmin?: boolean;
  role?: "client" | "user" | "programmer";
  tokenIdentifier: string;
  isOnline: boolean;
  image?: string;
  _creationTime: number;
}

interface Message {
  _id: Id<"messages">;
  conversation: Id<"conversations">;
  sender: User;
  content: string;
  messageType: "text" | "image" | "video";
  _creationTime: number;
}

interface Conversation {
  _id: Id<"conversations">;
  lastMessage: {
    sender: User | null;
    content: string;
    messageType: "text" | "image" | "video";
    _creationTime: number;
  } | null;
  participants: Id<"users">[];
  isGroup: boolean;
  groupName?: string;
  groupImage?: string;
  messageType: "text" | "image" | "video";
}

type ConversationQueryResult = Conversation | { message: string };

const MessageContainer = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const createConversation = useMutation(api.conversations.createUserConversation);
  // Fetch current user and conversation
  const me = useQuery(api.users.getMe);
  const conversationResult = useQuery(api.conversations.getUserConversation, {});

  // Determine if we have a valid conversation
  const conversation = conversationResult && !("message" in conversationResult) ? conversationResult : null;

  // Fetch messages only if we have a valid conversation ID
  const messages = useQuery(
    api.messages.getMessages,
    conversation ? { conversation: conversation._id } : "skip"
  );

  // Scroll to bottom when messages change
  useEffect(() => {
    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  // Loading state
  if (me === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center bg-chat-tile-light dark:bg-chat-tile-dark">
        <LoaderUI />
      </div>
    );
  }

  // No conversation selected state
  if (conversationResult === undefined || conversation === null) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center pt-20 pb-20 bg-chat-tile-light dark:bg-chat-tile-dark p-4">
        <div className="mt-10 mb-10">
          <button
            className="bg-blue-600 mt-20 mb-20 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 ease-in-out focus:outline-none"
            onClick={async () => {
              try {
                const conversationId = await createConversation({});
                console.log("Conversation started with ID:", conversationId);
                // Optionally refresh or navigate to the conversation
              } catch (error) {
                console.error("Error creating conversation:", error);
              }
            }}
          >
            Start a Conversation
          </button>
        </div>
      </div>
    );
  }

  // Error state
  if ("message" in conversationResult) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-500 dark:text-red-400 bg-chat-tile-light dark:bg-chat-tile-dark">
        {conversationResult.message}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full flex flex-col overflow-hidden bg-chat-tile-light dark:bg-chat-tile-dark"
    >
      {/* Scrollable messages area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="mx-12 flex flex-col gap-3">
          {messages === undefined ? (
            <div className="flex items-center justify-center h-full">
              <LoaderUI />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <>
              {messages.map((msg: Message) => (
                <ChatBubble
                  key={msg._id}
                  message={msg}
                  me={me}
                  previousMessage={undefined} // You might want to implement this properly
                />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;