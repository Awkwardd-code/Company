"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, X } from 'lucide-react';
import ChatPlaceHolder from './Chats/chat-placeholder';
import { Id } from '../../convex/_generated/dataModel';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import MessageContainer from './Widgets/message-container';
import MessageInput from './Widgets/message-input';
import Link from 'next/link';

const ChatWidget = () => {
  const { user, isLoaded } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  
  // If not loaded, return null to avoid flashing content
  if (!isLoaded) return null;

  // If user is not authenticated, show sign-in prompt (hidden on mobile)
  if (!user) {
    return (
      <div className="hidden md:flex fixed bottom-5 right-5 z-[10000] bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl border flex-col items-center gap-4">
        <p className="text-gray-900 dark:text-gray-100">Please sign in to access the chat.</p>
        <Link
          href="/sign-in"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  // Existing logic for authenticated users
  const conversation = useQuery(api.conversations.getUserConversation, {});
  const me = useQuery(api.users.getMe);

  let otherUserId: Id<"users"> | null = null;

  if (conversation && 'participants' in conversation && me) {
    otherUserId = conversation.participants.find((id) => id !== me._id) || null;
  }

  const otherUser = useQuery(
    api.users.getUserById,
    otherUserId ? { userId: otherUserId } : "skip"
  );
  const conversationName = otherUser?.name;
  const conversationImage = otherUser?.image;

  return (
    <>
      {/* Chat Toggle Button - Hidden on mobile, with transition effect */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-[10000] transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'} hidden md:block`}
        aria-label="Toggle chat widget"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Panel - Hidden on mobile */}
      <div
        className={`hidden md:flex fixed bottom-5 right-16 z-[9999] transition-all duration-300 ease-in-out bg-white dark:bg-gray-800 shadow-xl border rounded-xl flex-col overflow-hidden ${isOpen ? 'h-[90vh] w-[60vw] opacity-100' : 'h-0 w-0 opacity-0'}`}
        style={{ top: isOpen ? '5vh' : 'auto', visibility: isOpen ? 'visible' : 'hidden' }}
      >
        {isOpen && (
          <>
            {/* Header */}
            <div className="w-full sticky top-0 z-50">
              <div className="flex justify-between bg-gray-100 dark:bg-gray-700 p-3 border-b border-gray-200 dark:border-gray-600">
                <div className='flex gap-3 items-center'>
                  <Avatar>
                    <AvatarImage src={conversationImage || "/placeholder.png"} className='object-cover' />
                    <AvatarFallback>
                      <div className='animate-pulse bg-gray-tertiary w-full h-full rounded-full' />
                    </AvatarFallback>
                  </Avatar>
                  <div className='flex flex-col'>
                    <p>{conversationName}</p>
                  </div>
                </div>

                {/* Right - Icons */}
                <div className="flex items-center gap-5">
                  <X
                    size={18}
                    className="cursor-pointer text-gray-900 dark:text-gray-100 hover:text-red-500 transition"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close chat"
                  />
                </div>
              </div>
            </div>

            {/* Chat content */}
            <MessageContainer />
            <MessageInput />
          </>
        )}
      </div>
    </>
  );
};

export default ChatWidget;