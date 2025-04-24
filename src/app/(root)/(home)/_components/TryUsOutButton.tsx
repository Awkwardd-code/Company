// components/TryUsOutButton.tsx
'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SignIn, useClerk, useUser } from '@clerk/nextjs'

export default function TryUsOutButton() {
  const { openSignIn } = useClerk();
  const { user, isLoaded } = useUser();

  return (

    <div
      onClick={user ? undefined : openSignIn ? () => openSignIn() : undefined}
      className="relative group inline-flex items-center gap-2 px-6 py-2 rounded-lg border border-blue-400/30
    bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/20 hover:to-purple-500/20
    text-sm font-medium text-blue-300 hover:text-white transition-all duration-300 vibrate-animation cursor-pointer"
    >
      {/* Optional glow background */}
      <span
        className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0
      group-hover:opacity-100 blur-md transition-all duration-500"
      />

      {/* Text */}
      <span className="relative z-10">Try Us Out</span>

      {/* Custom arrow icon */}
      <ArrowRight
        className="w-5 h-5 relative z-10 transform group-hover:translate-x-2 transition-transform duration-300"
      />
    </div>
  )
}
