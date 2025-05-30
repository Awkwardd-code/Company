"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Blocks } from "lucide-react";
import ModeToggle from "@/components/ModeToggle";
import { useUser } from "@clerk/nextjs";
import TryUsOutButton from "@/app/(root)/(home)/_components/TryUsOutButton";
import HeaderProfileBtn from "./HeaderProfileBtn";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import Image from "next/image";
import RightSidebar from "./Sidebar";

// Define types for Convex query result
interface UserProfile {
  id: string;
  role?: string;
  isAdmin?: boolean;
  tokenIdentifier: string;
}

function Header() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [isMobileScreen, setIsMobileScreen] = useState<boolean>(false);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const isLoggedIn = !!user?.id;

  // Use Convex's type inference for the query result
  const currentUser = useQuery(api.users.getUserByToken, isLoggedIn
    ? {
        tokenIdentifier: user.id,
      }
    : "skip");

  const showMeeting = currentUser?.role === "client" || currentUser?.role === "programmer";
  const isAdmin = currentUser?.isAdmin;

  // Detect screen size for mobile
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const isMobile = width < 768; // sm breakpoint and below
      setIsMobileScreen(isMobile);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Handle sticky header on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isLoaded) {
    return (
      <div className="h-20 bg-gradient-to-r from-[#0f0f1a] to-[#1a1a2e] flex items-center justify-between p-6">
        <div className="h-10 w-32 bg-gray-700/50 rounded animate-pulse" />
        <div className="h-10 w-24 bg-gray-700/50 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative z-20 w-full">
      <div
        ref={headerRef}
        className={`flex items-center justify-between 
          bg-gradient-to-r from-[#0f0f1a] to-[#1a1a2e] backdrop-blur-xl p-2 md:p-6 mb-4 rounded-lg
          transition box-shadow opacity transform duration-300 ease-in-out z-50 w-full
          ${isSticky
            ? "fixed top-0 left-0 right-0 shadow-lg opacity-95 -translate-y-1 scale-[0.98]"
            : "relative opacity-100 translate-y-0 scale-100"
          }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center gap-4 group relative" aria-label="CodeCraft homepage">
            <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-all duration-300 blur-xl pointer-events-none" />
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 p-1.5 bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-300 ease-in-out">
              <Image
                src="/logo.png"
                alt="CraftCode Logo"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text transition-all duration-300">
                CraftCode
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links and Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 md:gap-6 text-xs md:text-sm font-medium flex-wrap md:flex-nowrap">
            <Link
              href="/"
              className={`relative uppercase tracking-wide transition-all duration-300 ease-in-out group whitespace-nowrap focus-visible:outline-none
              ${pathname === "/" ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:via-blue-300 after:to-purple-400" : ""} 
              md:block hidden`}
            >
              <span className="relative z-10 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text group-hover:brightness-110 transition-all duration-300 ease-in-out uppercase">
                Home
              </span>
            </Link>
            <Link
              href="/team"
              className={`relative uppercase tracking-wide transition-all duration-300 ease-in-out group whitespace-nowrap focus-visible:outline-none
              ${pathname === "/team" ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:via-blue-300 after:to-purple-400" : ""} 
              md:block hidden`}
            >
              <span className="relative z-10 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text group-hover:brightness-110 transition-all duration-300 ease-in-out uppercase">
                Team
              </span>
            </Link>
            {isAdmin ? (
              <Link
                href="/admin"
                className={`relative uppercase tracking-wide transition-all duration-300 ease-in-out group whitespace-nowrap focus-visible:outline-none
                ${pathname === "/admin" ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:via-blue-300 after:to-purple-400" : ""} 
                md:block hidden`}
              >
                <span className="relative z-10 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text group-hover:brightness-110 transition-all duration-300 ease-in-out uppercase">
                  Dashboard
                </span>
              </Link>
            ) : (
              <Link
                href="/projects"
                className={`relative uppercase tracking-wide transition-all duration-300 ease-in-out group whitespace-nowrap focus-visible:outline-none
                ${pathname === "/projects" ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:via-blue-300 after:to-purple-400" : ""} 
                md:block hidden`}
              >
                <span className="relative z-10 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text group-hover:brightness-110 transition-all duration-300 ease-in-out uppercase">
                  Projects
                </span>
              </Link>
            )}
            {showMeeting && (
              <Link
                href="/meetings"
                className={`relative uppercase tracking-wide transition-all duration-300 ease-in-out group whitespace-nowrap focus-visible:outline-none
              ${pathname === "/meetings" ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:via-blue-300 after:to-purple-400" : ""} 
              md:block hidden`}
              >
                <span className="relative z-10 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text group-hover:brightness-110 transition-all duration-300 ease-in-out uppercase">
                  Meetings
                </span>
              </Link>
            )}
            <Link
              href="/blog"
              className={`relative uppercase tracking-wide transition-all duration-300 ease-in-out group whitespace-nowrap focus-visible:outline-none
              ${pathname === "/blogs" ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:via-blue-300 after:to-purple-400" : ""} 
              md:block hidden`}
            >
              <span className="relative z-10 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text group-hover:brightness-110 transition-all duration-300 ease-in-out uppercase">
                Blogs
              </span>
            </Link>
            <Link
              href="/faqs"
              className={`relative uppercase tracking-wide transition-all duration-300 ease-in-out group whitespace-nowrap focus-visible:outline-none
              ${pathname === "/faqs" ? "after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-blue-400 after:via-blue-300 after:to-purple-400" : ""} 
              md:block hidden`}
            >
              <span className="relative z-10 bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text group-hover:brightness-110 transition-all duration-300 ease-in-out uppercase">
                FAQs
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 overflow-hidden px-5 py-1">
            <ModeToggle />
            {user ? <HeaderProfileBtn /> : <TryUsOutButton />}
            {isMobileScreen && <RightSidebar />}
          </div>
        </div>
      </div>

      {isSticky && (
        <div className="h-20 w-full" />
      )}
    </div>
  );
}

export default Header;