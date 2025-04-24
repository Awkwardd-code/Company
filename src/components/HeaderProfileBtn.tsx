"use client";
// import LoginButton from "@/components/LoginButton";
import LoginButton from "@/components/LoginButton";
import { SignedOut, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";


function HeaderProfileBtn() {
  return (
    <div
      className="relative px-3 py-2 rounded-md transition-all duration-300 mt-2 cursor-pointer
      hover:bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:ring-2 hover:ring-blue-500 hover:ring-opacity-30"
    >
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Link
            label="Profile"
            labelIcon={<User className="size-4" />}
            href="/profile"
          />
        </UserButton.MenuItems>
      </UserButton>

      <SignedOut>
        <LoginButton />
      </SignedOut>
    </div>
  );
}
export default HeaderProfileBtn;