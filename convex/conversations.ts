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

		const conversations = await ctx.db.query("conversations").collect();

		const myConversation = conversations.find((conversation) => {
			return !conversation.isGroup && conversation.participants.includes(user._id);
		});

		if (!myConversation) {
			return { message: "No conversation found for this user" };
		}

		const lastMessage = await ctx.db
			.query("messages")
			.filter((q) => q.eq(q.field("conversation"), myConversation._id))
			.order("desc")
			.take(1);

		// Fetch the sender's full user details
		const senderId = lastMessage[0]?.sender;
		const senderDetails = senderId
			? await ctx.db.query("users").filter((q) => q.eq(q.field("_id"), senderId)).take(1)
			: null;

		return {
			...myConversation,
			lastMessage: lastMessage[0] ? {
				...lastMessage[0],
				sender: senderDetails ? senderDetails[0] : null,
			} : null,
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

		
		const admin = await ctx.db
			.query("users")
			.filter((q) => q.eq(q.field("name"), "CodeCraft "))
			.first();

		if (!admin) {
			throw new Error("Admin user not found");
		}


		const allConversations = await ctx.db.query("conversations").collect();

		const existingConversation = allConversations.find((conv) => {
			if (conv.isGroup) return false;
			const participantIds = conv.participants.map((id) => id.toString());
			return (
				participantIds.includes(currentUser._id.toString()) &&
				participantIds.includes(admin._id.toString()) &&
				participantIds.length === 2
			);
		});

		if (existingConversation) {
			return existingConversation._id;
		}

		
		const conversationId = await ctx.db.insert("conversations", {
			participants: [currentUser._id, admin._id],
			isGroup: false,
		});

		return conversationId;
	},
});