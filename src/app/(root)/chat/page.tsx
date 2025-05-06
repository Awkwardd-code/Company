"use client";


import React, { useState, useEffect } from "react";
import ChatPage from "./_components/ChatPage";
import Header from "@/components/HeaderComponent";
import BottomHeader from "@/components/BottomHeader";

function Page() {
  // State to track the screen width
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  // Update screen size state on component mount and when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768); // You can adjust this breakpoint
    };

    handleResize(); // Set initial state on mount
    window.addEventListener("resize", handleResize); // Add event listener

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isSmallScreen && (
        <div>
          <ChatPage />
        </div>
      )}
    </>
  );
}

export default Page;
