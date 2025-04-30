"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";


interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider = ({ children }: AdminProviderProps) => {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  const currentUser = useQuery(api.users.getMe, {});

  useEffect(() => {
    if (currentUser === undefined) return; // still loading
    if (!currentUser?.isAdmin) {
      router.push("/");
    } else {
      setChecked(true);
    }
  }, [currentUser, router]);

  if (!checked) return null; // or a spinner

  return <>{children}</>;
};
