import ChatBubble from "./chat-bubble";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import LoaderUI from "../LoaderUI";
import type { Id } from "../../../convex/_generated/dataModel";
import { motion } from "framer-motion";

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
  const [isCreating, setIsCreating] = useState(false);
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

  const handleCreateConversation = async () => {
    setIsCreating(true);
    try {
      await createConversation({});
    } catch (error) {
      console.error("Error creating conversation:", error);
    } finally {
      setIsCreating(false);
    }
  };

  // Loading state
  if (me === undefined) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <LoaderUI />
      </div>
    );
  }

  // No conversation selected state
  if (conversationResult === undefined || conversation === null) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex flex-col h-full overflow-hidden items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 p-4"
      >
        <div className="text-center max-w-md">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 mx-auto text-blue-500 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            No Active Conversation
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start a new conversation to connect with others. Your messages will appear here.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreateConversation}
            disabled={isCreating}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isCreating ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Starting...
              </span>
            ) : (
              "Start a Conversation"
            )}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // Error state
  if ("message" in conversationResult) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-red-500 dark:text-red-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-lg font-medium text-red-800 dark:text-red-200 mb-2">
            Error Loading Conversation
          </h3>
          <p className="text-red-600 dark:text-red-300">
            {conversationResult.message}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full flex flex-col z-0 overflow-y-auto bg-chat-tile-light dark:bg-chat-tile-dark"
    >
      {/* Scrollable messages area */}
      <div className="flex-1 p-4   overflow-y-auto">
        <div className="mx-auto max-w-3xl flex flex-col gap-4">
          {messages === undefined ? (
            <div className="flex items-center justify-center h-64">
              <LoaderUI />
            </div>
          ) : messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400 dark:text-gray-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                No messages yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Be the first to send a message!
              </p>
            </motion.div>
          ) : (
            <>
              <div className="text-center my-4">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                  {new Date(messages[0]._creationTime).toLocaleDateString()}
                </span>
              </div>
              
              {messages.map((msg: Message, index: number) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ChatBubble
                    message={msg}
                    me={me}
                    previousMessage={index > 0 ? messages[index - 1] : undefined}
                    className={msg.messageType === "image" || msg.messageType === "video" ? "media-message" : ""}
                  />
                </motion.div>
              ))}
              <div ref={messagesEndRef} className="h-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;