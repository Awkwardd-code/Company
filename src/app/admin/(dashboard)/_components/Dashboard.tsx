"use client";

import ActionCard from "@/components/ActionCard";
import { QUICK_ACTIONS } from "@/constants";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import LoaderUI from "@/components/LoaderUI";
import { useState } from "react";
import { Calendar, Users } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const { isLoading } = useUserRole();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      case "Schedule":
        router.push("/admin/schedule");
        break;
      case "Users":
        router.push("/admin/users");
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };

  // Inline custom actions
  const additionalActions = [
    {
      icon: Calendar,
      title: "Schedule",
      description: "Plan upcoming interviews",
      color: "blue-500",
      gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    },
    {
      icon: Users,
      title: "Users",
      description: "Manage users and roles",
      color: "purple-500",
      gradient: "from-purple-500/10 via-purple-500/5 to-transparent",
    },
  ];

  if (isLoading) return <LoaderUI />;

  return (
    <div className="container max-w-7xl mx-auto p-6">
      {/* Welcome */}
      <div className="rounded-lg bg-card p-6 border shadow-sm mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
          Welcome back!
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your interviews and review candidates effectively
        </p>
      </div>

      {/* Action cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...QUICK_ACTIONS, ...additionalActions].map((action) => (
          <ActionCard
            key={action.title}
            action={action}
            onClick={() => handleQuickAction(action.title)}
          />
        ))}
      </div>

      {/* Meeting modal */}
      <MeetingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
        isJoinMeeting={modalType === "join"}
      />
    </div>
  );
}
