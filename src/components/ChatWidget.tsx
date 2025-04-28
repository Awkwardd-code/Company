"use client";

import { useState, useEffect, useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, X } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';
import MessageContainer from './Widgets/message-container';
import MessageInput from './Widgets/message-input';
import DummyMessageInput from './Widgets/DummyMessageInput';
import StaticMessageContainer from './Widgets/StaticMessageContainer';

// Type Definitions
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

// Main Chat Widget Component
const ChatWidget: React.FC = () => {
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [hasConversation, setHasConversation] = useState<boolean>(false);

  // Convex Queries
  const conversation = useQuery(
    api.conversations.getUserConversation,
    user ? {} : "skip"
  ) as Conversation | undefined | "skip";
  
  const me = useQuery(
    api.users.getMe,
    user ? {} : "skip"
  ) as User | undefined | "skip";

  const otherUserId = useMemo(() => {
    if (conversation && typeof conversation !== "string" && 'participants' in conversation && me && typeof me !== "string") {
      return conversation.participants.find((id: Id<"users">) => id !== me._id) || null;
    }
    return null;
  }, [conversation, me]);

  const otherUser = useQuery(
    api.users.getUserById,
    otherUserId ? { userId: otherUserId } : "skip"
  ) as User | undefined | "skip";

  // Memoized conversation details
  const conversationName = useMemo(() => 
    user ? (otherUser && typeof otherUser !== "string" ? otherUser.name : "Conversation") : "Guest",
    [user, otherUser]
  );

  const conversationImage = useMemo(() => 
    user ? (otherUser && typeof otherUser !== "string" ? otherUser.image : "/placeholder.png") : "/placeholder.png",
    [user, otherUser]
  );

  // Conversation status effect with debugging
  useEffect(() => {
    console.log('Conversation state:', { conversation, isLoaded, user });
    if (conversation && typeof conversation !== "string" && conversation.participants?.length > 0) {
      console.log('Setting hasConversation to true');
      setHasConversation(true);
    } else {
      console.log('Setting hasConversation to false');
      setHasConversation(false);
    }
  }, [conversation]);

  // Loading state
  if (!isLoaded || conversation === undefined || me === undefined) {
    return (
      <div className="fixed bottom-5 right-5 z-[10000] animate-pulse">
        <div className="bg-blue-600 text-white p-4 rounded-full shadow-lg">
          <MessageSquare className="w-6 h-6" />
        </div>
      </div>
    );
  }

  // Error state
  if (conversation === null || me === null) {
    return (
      <div className="fixed bottom-5 right-5 z-[10000] bg-red-100 p-4 rounded-lg">
        Error loading chat data
      </div>
    );
  }

  // Debug rendering state
  console.log('Rendering with:', { hasConversation, user: !!user });

  return (
    <>
      <ChatToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
      <ChatPanel 
        isOpen={isOpen} 
        setIsOpen={setIsOpen} 
        conversationName={conversationName || "Conversation"} 
        conversationImage={conversationImage || "/placeholder.png"}
      >
        {!user ? (
          <>
            <StaticMessageContainer />
            <DummyMessageInput />
          </>
        ) : !hasConversation ? (
          <>
            <MessageContainer/>
            <DummyMessageInput />
          </>
        ) : (
          <>
            <MessageContainer />
            <MessageInput />
          </>
        )}
      </ChatPanel>
    </>
  );
};

// Chat Toggle Button Component
const ChatToggleButton: React.FC<ChatToggleButtonProps> = ({ isOpen, setIsOpen }) => (
  <button
    onClick={() => setIsOpen(true)}
    className={`fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-[10000] transition-all duration-300 ease-in-out ${
      isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
    } hidden md:block focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    aria-label="Toggle chat widget"
    aria-expanded={isOpen}
    aria-controls="chat-panel"
  >
    <MessageSquare className="w-6 h-6" aria-hidden="true" />
  </button>
);

// Chat Panel Component
const ChatPanel: React.FC<ChatPanelProps> = ({ 
  isOpen, 
  setIsOpen, 
  conversationName, 
  conversationImage, 
  children 
}) => (
  <div
    className={`fixed bottom-5 right-5 md:right-16 z-[9999] transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-xl border rounded-xl flex-col overflow-hidden 
      ${isOpen 
        ? 'h-[90vh] w-[95vw] sm:w-[80vw] md:w-[50vw] lg:w-[40vw] opacity-100' 
        : 'h-0 w-0 opacity-0'
      }`}
    style={{ top: isOpen ? '5vh' : 'auto', visibility: isOpen ? 'visible' : 'hidden' }}
    id="chat-panel"
    role="dialog"
    aria-label="Chat window"
  >
    {isOpen && (
      <>
        {/* Header */}
        <div className="w-full sticky top-0 z-50">
          <div className="flex justify-between bg-gray-100 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600">
            <div className="flex gap-3 items-center">
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversationImage} className="object-cover" alt={`${conversationName}'s avatar`} />
                <AvatarFallback>
                  <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="font-medium">{conversationName}</p>
              </div>
            </div>

            {/* Close Button */}
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

        {/* Chat Content */}
        <div className="flex-1 flex flex-col">{children}</div>
      </>
    )}
  </div>
);

export default ChatWidget;