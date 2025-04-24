import ChatBubble from "./chat-bubble";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import { useEffect, useRef } from "react";
import LoaderUI from "../LoaderUI";


const MessageContainer = () => {
  // const { selectedConversation } = useConversationStore();

  const conversation = useQuery(api.conversations.getUserConversation, {});
  const me = useQuery(api.users.getMe);

  const conversationId =
    conversation && "_id" in conversation ? conversation._id : null;

  // Conditionally call the query — this is key!
  const messages = useQuery(
    api.messages.getMessages,
    conversationId ? { conversation: conversationId } : "skip"
  );

  // const me = useQuery(api.users.getMe);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);


  if (!me) {
    return <div><LoaderUI /></div>; // Add loading indicator while `me` is being fetched
  }

  if (!conversation) {
    return <div>No conversation available.</div>; // Handle if no conversation is available
  }

  // Handle the case where no conversation is found
  if ('message' in conversation) {
    return <div>{conversation.message}</div>;
  }

  return (
		<div className="relative p-4 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark">
			<div className="mx-12 flex flex-col gap-3">
				{messages?.map((msg, idx) => (
					<div key={msg._id} ref={lastMessageRef}>
						<ChatBubble
							message={msg}
							me={me} // `me` is guaranteed to be defined here
							previousMessage={idx > 0 ? messages[idx - 1] : undefined}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default MessageContainer;

