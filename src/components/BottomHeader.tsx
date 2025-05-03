"use client";

import React, { useState, useEffect } from "react";
import {
  Home,
  Users,
  FileText,
  MessageSquare,
  Archive,
  CalendarClock,
} from "lucide-react";
import Link from "next/link";
import { FiInbox } from "react-icons/fi";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { usePathname } from "next/navigation";

const BottomHeader = () => {
  const [isAtFooter, setIsAtFooter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  const { user } = useUser();
  const isLoggedIn = !!user?.id;

  const currentUser = useQuery(
    api.users.getUserByToken,
    isLoggedIn
      ? {
          tokenIdentifier: user.id,
        }
      : "skip"
  );

  const showMeeting =
    currentUser?.role === "client" || currentUser?.role === "programmer";
  const isAdmin = currentUser?.isAdmin;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (!footer) return setIsAtFooter(false);

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      setIsAtFooter(
        footerRect.top <= windowHeight && footerRect.bottom >= 0
      );
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getFooterBottom = () => {
    const footer = document.querySelector("footer");
    if (!footer) return "0px";
    return `${footer.offsetTop + footer.offsetHeight}px`;
  };

  if (!isMobile) return null;

  const isActive = (path: string) => pathname === path;

  const linkClass = (path: string) =>
    `flex-1 flex justify-center items-center transform hover:scale-110 ${
      isActive(path) ? "text-blue-400" : "text-white"
    }`;

  return (
    <div
      className={`w-full bg-gradient-to-r from-[#0f0f1a] to-[#1a1a2e] p-6 pb-8 backdrop-blur-lg border-t border-white/10 z-50 transition-all duration-500 ease-in-out ${
        isAtFooter
          ? "absolute translate-y-0 opacity-100 mb-0"
          : "fixed bottom-0 left-0 translate-y-4 opacity-95 mb-4"
      }`}
      style={isAtFooter ? { top: getFooterBottom() } : {}}
    >
      <nav
        className="flex justify-between items-center text-lg font-medium"
        role="navigation"
        aria-label="Bottom navigation"
      >
        <Link href="/" className={linkClass("/")}>
          <Home size={24} />
        </Link>

        <Link href="/team" className={linkClass("/team")}>
          <Users size={24} />
        </Link>

        <Link href="/blog" className={linkClass("/blog")}>
          <FileText size={24} />
        </Link>

        {showMeeting && (
          <Link href="/meetings" className={linkClass("/meetings")}>
            <CalendarClock size={24} />
          </Link>
        )}

        {isAdmin ? (
          <Link href="/admin" className={linkClass("/admin")}>
            <Archive size={24} />
          </Link>
        ) : (
          <Link href="/projects" className={linkClass("/projects")}>
            <Archive size={24} />
          </Link>
        )}

        <Link href="/faqs" className={linkClass("/faqs")}>
          <MessageSquare size={24} />
        </Link>

        <Link href="/chat" className={linkClass("/chat")}>
          <FiInbox size={24} />
        </Link>
      </nav>
    </div>
  );
};

export default BottomHeader;
