import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useUserRole = () => {
  const { user } = useUser();

  const userData = useQuery(api.users.getUserByClerkId, {
    tokenIdentifier: user?.id || "", // ✅ Corrected field name
  });

  const isLoading = userData === undefined;

  return {
    isLoading,
    isInterviewer: userData?.role === "programmer",
    isCandidate: userData?.role === "user" || userData?.role === "client",
    user: userData,
  };
};
