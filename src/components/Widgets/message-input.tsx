import { Laugh, Mic, Send } from "lucide-react";
import { Input } from "../ui/input";
import { useState } from "react";
import { Button } from "../ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import toast from "react-hot-toast";
import useComponentVisible from "@/hooks/useComponentVisible";
import EmojiPicker, { Theme } from "emoji-picker-react";
import MediaDropdown from "./media-dropdown";
import { Id } from "../../../convex/_generated/dataModel";

const MessageInput = () => {
  const [msgText, setMsgText] = useState("");
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

  // Use the query to fetch the user's conversation
  const conversation = useQuery(api.conversations.getUserConversation, {});
  const me = useQuery(api.users.getMe);

  let otherUserId: Id<"users"> | null = null;

  if (conversation && "participants" in conversation && me) {
    otherUserId = conversation.participants.find((id) => id !== me._id) || null;
  }

  // Fetch the other user using their ID
  const otherUser = useQuery(
    api.users.getUserById,
    otherUserId ? { userId: otherUserId } : "skip"
  );

  const sendTextMsg = useMutation(api.messages.sendTextMessage);

  const handleSendTextMsg = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedText = msgText.trim();
    if (!trimmedText) {
      toast.error("Cannot send an empty message.");
      return;
    }

    if (!conversation || !me || !otherUser || !("_id" in conversation)) {
      toast.error("Conversation or user information is missing.");
      return;
    }

    try {
      await sendTextMsg({
        content: trimmedText,
        conversation: conversation._id,
        sender: me._id,
      });
      setMsgText("");
    } catch (err: any) {
      toast.error(err.message);
      console.error(err);
    }
  };


  return (
    <div
      className="bg-gray-primary p-2 flex gap-4  items-center h-[10%] min-h-[48px] max-h-[48px] z-[99999] box-sizing-border-box"
      style={{ boxSizing: "border-box" }}
    >
      <div className="relative flex gap-2 ml-2 items-center">
        {/* EMOJI PICKER */}
        <div ref={ref} onClick={() => setIsComponentVisible(true)}>
          {isComponentVisible && (
            <EmojiPicker
              theme={Theme.DARK}
              onEmojiClick={(emojiObject) => {
                setMsgText((prev) => prev + emojiObject.emoji);
              }}
              style={{
                position: "absolute",
                bottom: "48px",
                left: "0",
                zIndex: 450,
              }}
            />
          )}
          <Laugh className="text-gray-600 dark:text-gray-400 cursor-pointer" />
        </div>
        <MediaDropdown />
      </div>
      <form onSubmit={handleSendTextMsg} className="w-full flex gap-3 h-full items-center">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Type a message"
            className="py-2 text-sm w-full rounded-lg shadow-sm bg-gray-tertiary focus-visible:ring-transparent h-10"
            value={msgText}
            onChange={(e) => setMsgText(e.target.value)}
          />
        </div>
        <div className="mr-4 flex items-center gap-3">
          {msgText.trim().length > 0 ? (
            <Button
              type="submit"
              size="sm"
              className="bg-transparent text-foreground hover:bg-transparent"
            >
              <Send />
            </Button>
          ) : (
            <Button
              type="submit"
              size="sm"
              disabled
              className="bg-transparent text-foreground hover:bg-transparent"
            >
              <Mic />
            </Button>
          )}

        </div>
      </form>
    </div>
  );
};

export default MessageInput;