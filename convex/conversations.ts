import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createConversation = mutation({
	args: {
		participants: v.array(v.id("users")),
		isGroup: v.boolean(),
		groupName: v.optional(v.string()),
		groupImage: v.optional(v.id("_storage")),
		admin: v.optional(v.id("users")),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Unauthorized");

		// jane and john
		// [jane, john]
		// [john, jane]

		const existingConversation = await ctx.db
			.query("conversations")
			.filter((q) =>
				q.or(
					q.eq(q.field("participants"), args.participants),
					q.eq(q.field("participants"), args.participants.reverse())
				)
			)
			.first();

		if (existingConversation) {
			return existingConversation._id;
		}

		let groupImage;

		if (args.groupImage) {
			groupImage = (await ctx.storage.getUrl(args.groupImage)) as string;
		}

		const conversationId = await ctx.db.insert("conversations", {
			participants: args.participants,
			isGroup: args.isGroup,
			groupName: args.groupName,
			groupImage,
			admin: args.admin,
		});

		return conversationId;
	},
});

export const getMyConversations = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Unauthorized");


		const cleanToken = identity.tokenIdentifier.replace(/^https?:\/\//, "");

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) =>
				q.eq("tokenIdentifier", cleanToken)
			)
			.unique();
		console.log(user)
		if (!user) throw new ConvexError("User not found");

		const conversations = await ctx.db.query("conversations").collect();

		const myConversations = conversations.filter((conversation) => {
			return conversation.participants.includes(user._id);
		});

		const conversationsWithDetails = await Promise.all(
			myConversations.map(async (conversation) => {
				let userDetails = {};

				if (!conversation.isGroup) {
					const otherUserId = conversation.participants.find((id) => id !== user._id);
					const userProfile = await ctx.db
						.query("users")
						.filter((q) => q.eq(q.field("_id"), otherUserId))
						.take(1);

					userDetails = userProfile[0];
				}

				const lastMessage = await ctx.db
					.query("messages")
					.filter((q) => q.eq(q.field("conversation"), conversation._id))
					.order("desc")
					.take(1);

				return {
					...userDetails,
					...conversation,
					lastMessage: lastMessage[0] || null,
				};
			})
		);

		return conversationsWithDetails;
	},
});

export const kickUser = mutation({
	args: {
		conversationId: v.id("conversations"),
		userId: v.id("users"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Unauthorized");

		const conversation = await ctx.db
			.query("conversations")
			.filter((q) => q.eq(q.field("_id"), args.conversationId))
			.unique();

		if (!conversation) throw new ConvexError("Conversation not found");

		await ctx.db.patch(args.conversationId, {
			participants: conversation.participants.filter((id) => id !== args.userId),
		});
	},
});

export const generateUploadUrl = mutation(async (ctx) => {
	return await ctx.storage.generateUploadUrl();
});


export const getUserConversation = query({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Unauthorized");

		const cleanToken = identity.tokenIdentifier.replace(/^https?:\/\//, "");

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) =>
				q.eq("tokenIdentifier", cleanToken)
			)
			.unique();

		if (!user) throw new ConvexError("User not found");

		// Fetch conversations where the user is a participant (both group and non-group)
		const conversations = await ctx.db.query("conversations").collect();

		// Find the conversation where the user is a participant
		const myConversation = conversations.find((conversation) => {
			return conversation.participants.includes(user._id);
		});

		if (!myConversation) {
			return { message: "No conversation found for this user" };
		}

		// Fetch the last message for the found conversation
		const lastMessage = await ctx.db
			.query("messages")
			.filter((q) => q.eq(q.field("conversation"), myConversation._id))
			.order("desc")
			.take(1);

		// Fetch the sender's full user details for the last message
		const senderId = lastMessage[0]?.sender;
		const senderDetails = senderId
			? await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), senderId)).take(1)
			: null;

		// Return the conversation details with the last message and sender details
		return {
			...myConversation,
			lastMessage: lastMessage[0]
				? {
					...lastMessage[0],
					sender: senderDetails ? senderDetails[0] : null,
				}
				: null,
		};
	},
});



export const createUserConversation = mutation({
	args: {},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) {
			throw new Error("User not authenticated");
		}

		const cleanToken = identity.tokenIdentifier.replace(/^https?:\/\//, "");

		const currentUser = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) =>
				q.eq("tokenIdentifier", cleanToken)
			)
			.unique();

		if (!currentUser) {
			throw new Error("Current user not found");
		}

		const admins = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("isAdmin"), true))
			.collect();

		if (admins.length === 0) {
			throw new Error("No admin users found");
		}

		// Check if the group conversation already exists
		const allConversations = await ctx.db.query("conversations").collect();

		const existingGroup = allConversations.find((conv) => {
			if (!conv.isGroup) return false;
			const participantIds = conv.participants.map((id) => id.toString());
			const allIds = [currentUser._id.toString(), ...admins.map(a => a._id.toString())];
			return (
				participantIds.length === allIds.length &&
				allIds.every(id => participantIds.includes(id))
			);
		});

		if (existingGroup) {
			return existingGroup._id;
		}

		const newConversationId = await ctx.db.insert("conversations", {
			participants: [currentUser._id, ...admins.map(admin => admin._id)],
			isGroup: true,
			groupName: currentUser.name,
			groupImage: currentUser.image,
			// admin: undefined or omit it
		});

		return newConversationId;
	},
});


export const deleteConversation = mutation({
	args: { conversationId: v.id("conversations") },
	handler: async (ctx, { conversationId }) => {
		const messages = await ctx.db.query("messages")
			.withIndex("by_conversation", q => q.eq("conversation", conversationId))
			.collect();

		for (const msg of messages) {
			await ctx.db.delete(msg._id);
		}

		await ctx.db.delete(conversationId);
	},
});