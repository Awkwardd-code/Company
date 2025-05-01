"use client";

import React, { useState, useEffect } from "react";
import { Home, Users, FileText, MessageSquare, Archive, CalendarClock } from "lucide-react";
import Link from "next/link";
import { FiInbox } from "react-icons/fi";
import { useUser } from "@clerk/nextjs"; // Adjust this to your auth system
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const BottomHeader = () => {
  const [isAtFooter, setIsAtFooter] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { user } = useUser();
  const currentUser = useQuery(api.users.getUserByToken, {
    tokenIdentifier: user?.id || "",
  });

  const showMeeting = currentUser?.role === "client" || currentUser?.role === "programmer";

  // Check if the user is an admin
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

      setIsAtFooter(footerRect.top <= windowHeight && footerRect.bottom >= 0);
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

  return (
    <div
      className={`w-full bg-gradient-to-r from-[#0f0f1a] to-[#1a1a2e] p-6 pb-8 backdrop-blur-lg border-t border-white/10 z-50 transition-all duration-500 ease-in-out ${
        isAtFooter
          ? "absolute translate-y-0 opacity-100 mb-0"
          : "fixed bottom-0 left-0 translate-y-4 opacity-95 mb-4"
      }`}
      style={isAtFooter ? { top: getFooterBottom() } : {}}
    >
      <nav className="flex justify-between items-center text-white text-lg font-medium" role="navigation" aria-label="Bottom navigation">
        <Link href="/" className="flex-1 flex justify-center items-center hover:text-blue-400 transform hover:scale-110">
          <Home size={24} />
        </Link>

        <Link href="/team" className="flex-1 flex justify-center items-center hover:text-blue-400 transform hover:scale-110">
          <Users size={24} />
        </Link>

        <Link href="/blogs" className="flex-1 flex justify-center items-center hover:text-blue-400 transform hover:scale-110">
          <FileText size={24} />
        </Link>

        {showMeeting && (
          <Link href="/meetings" className="flex-1 flex justify-center items-center hover:text-blue-400 transform hover:scale-110">
            <CalendarClock size={24} />
          </Link>
        )}

        {/* Conditional Link for Projects or Dashboard */}
        {isAdmin ? (
          <Link
            href="/admin"
            className="flex-1 flex justify-center items-center hover:text-blue-400 transform hover:scale-110"
          >
            <Archive size={24} />
          </Link>
        ) : (
          <Link
            href="/projects"
            className="flex-1 flex justify-center items-center hover:text-blue-400 transform hover:scale-110"
          >
            <Archive size={24} />
          </Link>
        )}

        <Link href="/faqs" className="flex-1 flex justify-center items-center hover:text-blue-400 transform hover:scale-110">
          <MessageSquare size={24} />
        </Link>

        <Link href="/chat" className="flex-1 flex justify-center items-center hover:text-blue-400 transform hover:scale-110">
          <FiInbox size={24} />
        </Link>
      </nav>
    </div>
  );
};

export default BottomHeader;
