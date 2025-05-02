"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const { user, isLoaded } = useUser();

  // Wait until Clerk finishes loading before rendering anything
  if (!isLoaded) return null;

  // If no authenticated user, redirect immediately
  if (!user) {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
    return null;
  }

  // Once user is confirmed, render the logic that fetches Convex user
  return <AdminCheck>{children}</AdminCheck>;
};

const AdminCheck = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const currentUser = useQuery(api.users.getMe, {});

  useEffect(() => {
    if (currentUser === undefined) return;

    if (!currentUser?.isAdmin) {
      router.push("/");
    } else {
      setChecked(true);
    }
  }, [currentUser, router]);

  if (!checked) return null;

  return <>{children}</>;
};
