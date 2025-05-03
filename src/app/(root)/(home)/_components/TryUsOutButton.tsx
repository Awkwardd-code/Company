// components/TryUsOutButton.tsx
'use client'

import { useClerk, useUser } from '@clerk/nextjs'
import { ArrowRight } from 'lucide-react'

export default function TryUsOutButton() {
  const { openSignIn } = useClerk();
  const { user, isLoaded } = useUser();

  const handleClick = () => {
    if (!user && openSignIn) {
      openSignIn();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') handleClick();
      }}
      className={`relative group inline-flex items-center gap-2 px-6 py-2 rounded-lg border 
        border-blue-400/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10
        hover:from-blue-500/20 hover:to-purple-500/20 text-sm sm:text-base font-medium 
        text-blue-300 hover:text-white transition-all duration-300 vibrate-animation 
        cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 
        ${user ? 'pointer-events-none opacity-70' : ''}`}
    >
      <span
        className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0
        group-hover:opacity-100 blur-md transition-all duration-500"
      />
      
      {/* Hide text on mobile (screens smaller than 640px) */}
      <span className="relative z-10 hidden sm:block">Try Us Out</span>
      
      <ArrowRight className="w-5 h-5 relative z-10 transform group-hover:translate-x-2 transition-transform duration-300" />
    </div>
  )
}
