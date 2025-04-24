"use client";

import React, { useState, useEffect } from "react";
import { Home, Users, FileText, MessageSquare, Archive } from "lucide-react";
import Link from "next/link";

const BottomHeader = () => {
  const [isProjectAvailable, setIsProjectAvailable] = useState(false);
  const [isAtFooter, setIsAtFooter] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // Fixed typo: useState0 → useState

  useEffect(() => {
    // Check mobile screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Tailwind 'md' breakpoint
    };

    // Run on mount
    checkMobile();

    // Listen for resize events
    window.addEventListener("resize", checkMobile);

    // Simulate project availability
    setIsProjectAvailable(true);

    // Scroll detection for footer
    const handleScroll = () => {
      const footer = document.querySelector("footer");
      if (!footer) {
        console.warn("Footer not found in DOM");
        setIsAtFooter(false);
        return;
      }

      const footerRect = footer.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (footerRect.top <= windowHeight && footerRect.bottom >= 0) {
        setIsAtFooter(true);
      } else {
        setIsAtFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // Cleanup
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
      className={`w-full bg-gradient-to-r from-[#0f0f1a] to-[#1a1a2e] p-4 backdrop-blur-lg border-t border-white/10 z-50 transition-all duration-500 ease-in-out ${
        isAtFooter
          ? "absolute translate-y-0 opacity-100"
          : "fixed bottom-0 left-0 translate-y-4 opacity-95"
      }`}
      style={isAtFooter ? { top: getFooterBottom() } : {}}
    >
      <nav className="flex justify-between items-center text-white text-lg font-medium" role="navigation" aria-label="Bottom navigation">
        <Link
          href="/"
          className="flex-1 flex justify-center items-center text-white hover:text-blue-400 transition-colors duration-300 ease-in-out"
          aria-label="Home page"
        >
          <Home size={24} className="transform transition-transform duration-300 hover:scale-110" />
        </Link>

        <Link
          href="/team"
          className="flex-1 flex justify-center items-center text-white hover:text-blue-400 transition-colors duration-300 ease-in-out"
          aria-label="Team page"
        >
          <Users size={24} className="transform transition-transform duration-300 hover:scale-110" />
        </Link>

        <Link
          href="/blogs"
          className="flex-1 flex justify-center items-center text-white hover:text-blue-400 transition-colors duration-300 ease-in-out"
          aria-label="Blogs page"
        >
          <FileText size={24} className="transform transition-transform duration-300 hover:scale-110" />
        </Link>

        <Link
          href="/faqs"
          className="flex-1 flex justify-center items-center text-white hover:text-blue-400 transition-colors duration-300 ease-in-out"
          aria-label="FAQs page"
        >
          <MessageSquare size={24} className="transform transition-transform duration-300 hover:scale-110" />
        </Link>

        <Link
          href="/chat"
          className="flex-1 flex justify-center items-center text-white hover:text-blue-400 transition-colors duration-300 ease-in-out"
          aria-label="Chat page"
        >
          <MessageSquare size={24} className="transform transition-transform duration-300 hover:scale-110" />
        </Link>

        {isProjectAvailable && (
          <Link
            href="/projects"
            className="flex-1 flex justify-center items-center text-white hover:text-blue-400 transition-colors duration-300 ease-in-out"
            aria-label="Projects page"
          >
            <Archive size={24} className="transform transition-transform duration-300 hover:scale-110" />
          </Link>
        )}
      </nav>
    </div>
  );
};

export default BottomHeader;