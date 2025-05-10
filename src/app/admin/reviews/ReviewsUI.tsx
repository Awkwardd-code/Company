"use client";

import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../../../convex/_generated/api";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2Icon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";

interface SupportMessageWithUserImage {
  _id: Id<"supportMessages">;
  _creationTime: number;
  userId: Id<"users">;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  rating: number;
  termsAccepted: boolean;
  createdAt: number;
  userImage: string;
}

interface User {
  _id: Id<"users">;
  _creationTime: number;
  name: string;
  email: string;
  image?: string;
  isAdmin: boolean;
  role: "client" | "user" | "programmer";
  tokenIdentifier: string;
  isOnline: boolean;
}

function SupportMessagesUI() {
  const { user } = useUser();
  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<Id<"supportMessages"> | null>(null);

  // Fetch support messages and current user
  const messages = useQuery(api.supportMessages.getSupportMessages) as
    | SupportMessageWithUserImage[]
    | undefined;
  const auther = useQuery(api.users.getMe) as User | undefined;
  const hasSubmitted = useQuery(api.supportMessages.hasUserSubmitted, {
    userId: auther?._id ?? null,
  });
  const syncUser = useMutation(api.users.syncUser);
  const insertSupportMessage = useMutation(api.supportMessages.insertSupportMessage);
  const deleteSupportMessage = useMutation(api.supportMessages.deleteSupportMessage);

  // Sync Clerk user to Convex
  const [convexUserId, setConvexUserId] = useState<Id<"users"> | undefined>();
  useEffect(() => {
    if (user) {
      const sync = async () => {
        try {
          const userId = await syncUser({
            clerkUserId: user.id,
            name: user.fullName || "Unknown",
            email: user.primaryEmailAddress?.emailAddress || "",
            image: user.imageUrl,
          });
          setConvexUserId(userId);
        } catch (error) {
          console.error("Failed to sync user:", error);
          toast.error("Failed to sync user.");
        }
      };
      sync();
    }
  }, [user, syncUser]);

  // Form data for creating a new support message
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    rating: 1,
    termsAccepted: false,
  });

  const addSupportMessage = async () => {
    if (!user || !convexUserId) {
      toast.error("User not authenticated.");
      return;
    }

    setIsCreating(true);
    try {
      await insertSupportMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        rating: Number(formData.rating),
        termsAccepted: formData.termsAccepted,
      });

      setAddOpen(false);
      toast.success("Support message submitted successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        rating: 1,
        termsAccepted: false,
      });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to submit support message.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleRemoveMessage = async () => {
    if (!selectedMessageId) return;

    setIsSubmitting(true);
    try {
      await deleteSupportMessage({ id: selectedMessageId });
      setDeleteOpen(false);
      toast.success("Support message deleted successfully");
      setSelectedMessageId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete support message");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!messages || !auther || !convexUserId) {
    return (
      <div className="flex justify-center py-12">
        <Loader2Icon className="size-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Messages</h1>
          <p className="text-muted-foreground mt-1">View and manage support messages</p>
        </div>

        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={!convexUserId || hasSubmitted}
            >
              Submit Support Message
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[500px] bg-[#1a1a2e] border-[#2a2a3a] rounded-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl text-white">Submit Support Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Name*</label>
                <Input
                  placeholder="Your name"
                  name="name"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Email*</label>
                <Input
                  placeholder="Your email"
                  name="email"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Phone</label>
                <Input
                  placeholder="Your phone number"
                  name="phone"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Subject*</label>
                <Input
                  placeholder="Subject"
                  name="subject"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Message*</label>
                <Textarea
                  placeholder="Your message"
                  name="message"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Rating (1-5)*</label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  placeholder="Rating"
                  name="rating"
                  className="bg-[#2a2a3a] border-[#3a3a4a] text-white"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  <input
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) =>
                      setFormData({ ...formData, termsAccepted: e.target.checked })
                    }
                    className="mr-2"
                  />
                  I accept the terms and conditions*
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setAddOpen(false)}
                  className="border-[#3a3a4a] text-white hover:bg-[#3a3a4a]"
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={addSupportMessage}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2Icon className="mr-2 size-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Message"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-[450px] bg-[#1a1a2e] border-[#2a2a3a] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">Delete Support Message</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-300">
              Are you sure you want to delete this support message? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              className="border-[#3a3a4a] text-white hover:bg-[#3a3a4a]"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRemoveMessage}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {messages.length > 0 ? (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {messages.map((message) => (
            <div
              key={message._id}
              className="bg-[#1d1d2e] border border-[#2a2a3a] rounded-lg p-6 space-y-4 hover:shadow-md transition-shadow"
            >
              {message.userImage && (
                <div className="w-16 h-16 bg-[#2a2a3a] rounded-full border border-[#3a3a4a] overflow-hidden">
                  <img
                    src={message.userImage}
                    alt={`${message.name} avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white">{message.subject}</h3>
                <p className="text-sm text-gray-400">{message.message.substring(0, 100)}...</p>
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-200">Submitted By</h4>
                <p className="text-sm text-white">{message.name}</p>
                <p className="text-sm text-gray-400">{message.email}</p>
                {message.phone && (
                  <p className="text-sm text-gray-400">Phone: {message.phone}</p>
                )}
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-200">Rating</h4>
                <p className="text-sm text-white">{message.rating} / 5</p>
              </div>
              {auther.isAdmin && (
                <div className="flex justify-end pt-4">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setSelectedMessageId(message._id);
                      setDeleteOpen(true);
                    }}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400">No support messages found. Submit a message to get started.</p>
          {!hasSubmitted && (
            <Button
              onClick={() => setAddOpen(true)}
              className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Submit Your First Message
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default SupportMessagesUI;