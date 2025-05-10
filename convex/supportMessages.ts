import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Interface for support message with user image, aligned with schema and component
export interface SupportMessageWithUserImage {
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

export const insertSupportMessage = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    subject: v.string(),
    message: v.string(),
    rating: v.number(),
    termsAccepted: v.boolean(),
  },
  handler: async (ctx: MutationCtx, args) => {
    // Standard authentication and user lookup
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    const cleanToken = identity.tokenIdentifier.replace(/^https?:\/\//, "");
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", cleanToken))
      .unique();
    if (!user) {
      throw new ConvexError("User not found in users table");
    }
    const userId = user._id;

    // Check if the user already has a message
    const existingMessage = await ctx.db
      .query("supportMessages")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();
    if (existingMessage) {
      throw new ConvexError("User has already submitted a support message");
    }

    // Validate inputs
    if (args.name.length < 1 || args.name.length > 100) {
      throw new ConvexError("Name must be between 1 and 100 characters");
    }
    if (args.email.length < 1 || args.email.length > 100 || !/^\S+@\S+\.\S+$/.test(args.email)) {
      throw new ConvexError("Invalid email format");
    }
    if (args.phone && args.phone.length > 20) {
      throw new ConvexError("Phone number must not exceed 20 characters");
    }
    if (args.subject.length < 1 || args.subject.length > 200) {
      throw new ConvexError("Subject must be between 1 and 200 characters");
    }
    if (args.message.length < 1 || args.message.length > 5000) {
      throw new ConvexError("Message must be between 1 and 5000 characters");
    }
    if (!Number.isInteger(args.rating) || args.rating < 1 || args.rating > 5) {
      throw new ConvexError("Rating must be an integer between 1 and 5");
    }
    if (!args.termsAccepted) {
      throw new ConvexError("You must accept the terms");
    }

    // Insert the support message
    const messageId = await ctx.db.insert("supportMessages", {
      userId,
      name: args.name,
      email: args.email,
      phone: args.phone,
      subject: args.subject,
      message: args.message,
      rating: args.rating,
      termsAccepted: args.termsAccepted,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

export const hasUserSubmitted = query({
  args: {
    userId: v.union(v.id("users"), v.null()),
  },
  handler: async (ctx: QueryCtx, args) => {
    const { userId } = args;

    if (userId === null) {
      return false;
    }

    const messages = await ctx.db
      .query("supportMessages")
      .withIndex("by_userId", (q) => q.eq("userId", userId)) // TS now knows it's not null
      .collect();

    return messages.length > 0;
  },
});




export const getSupportMessages = query({
  args: {},
  handler: async (ctx: QueryCtx): Promise<SupportMessageWithUserImage[]> => {
    const messages = await ctx.db.query("supportMessages").order("desc").collect();

    const messagesWithUser = await Promise.all(
      messages.map(async (msg: Doc<"supportMessages">) => {
        let user: Doc<"users"> | null = null;
        try {
          user = await ctx.db.get(msg.userId);
        } catch (err) {
          console.error(`Failed to fetch user for userId: ${msg.userId}`, err, (err as Error).stack);
        }

        return {
          ...msg,
          userImage: user?.image ?? "/fallback-image.png",
          name: user?.name ?? msg.name, // Prefer user.name, fallback to msg.name
        } as SupportMessageWithUserImage;
      })
    );

    return messagesWithUser;
  },
});

export const deleteSupportMessage = mutation({
  args: {
    id: v.id("supportMessages"),
  },
  handler: async (ctx: MutationCtx, args: { id: Id<"supportMessages"> }) => {
    // Standard authentication and user lookup
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError("Unauthorized");
    }
    const cleanToken = identity.tokenIdentifier.replace(/^https?:\/\//, "");
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", cleanToken))
      .unique();
    if (!user) {
      throw new ConvexError("User not found in users table");
    }

    // Check if user is admin
    if (!user.isAdmin) {
      throw new ConvexError("Unauthorized: Admin access required");
    }

    // Fetch the message to verify existence
    const message = await ctx.db.get(args.id);
    if (!message) {
      throw new ConvexError("Support message not found");
    }

    // Delete the message
    await ctx.db.delete(args.id);
  },
});