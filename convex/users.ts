import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        email: v.string(),
        name: v.string(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("users", {
            tokenIdentifier: args.tokenIdentifier,
            email: args.email,
            name: args.name,
            image: args.image,
            isOnline: true,
            isAdmin: false,
            role: "user"
        });
    },
});

export const updateUser = internalMutation({
    args: { tokenIdentifier: v.string(), image: v.string() },
    async handler(ctx, args) {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique();

        if (!user) {
            throw new ConvexError("User not found");
        }

        await ctx.db.patch(user._id, {
            image: args.image,
        });
    },
});

export const setUserOnline = internalMutation({
    args: { tokenIdentifier: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique();

        console.log(user)

        if (!user) {
            throw new ConvexError("User not found");
        }

        await ctx.db.patch(user._id, { isOnline: true });
    },
});

export const setUserOffline = internalMutation({
    args: { tokenIdentifier: v.string() },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", args.tokenIdentifier))
            .unique();
        console.log(user);
        if (!user) {
            throw new ConvexError("User not found");
        }

        await ctx.db.patch(user._id, { isOnline: false });
    },
});

export const syncUser = mutation({
    args: {
        clerkUserId: v.string(),
        name: v.string(),
        email: v.string(),
        image: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("tokenIdentifier"), args.clerkUserId))
            .first();
        if (existing) {
            await ctx.db.patch(existing._id, {
                name: args.name,
                email: args.email,
                image: args.image,
            });
            return existing._id;
        }
        return await ctx.db.insert("users", {
            name: args.name,
            email: args.email,
            image: args.image,
            tokenIdentifier: args.clerkUserId,
            isAdmin: false,
            role: "user",
            isOnline: false,
        });
    },
});
export const getUsers = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        const users = await ctx.db.query("users").collect();
        const normalizedIdentityToken = identity.tokenIdentifier.replace(/^https?:\/\//, "");

        const everyoneExceptMe = users.filter(
            (user) => user.tokenIdentifier !== normalizedIdentityToken
        );
        return everyoneExceptMe;
    },
});

export const getMe = query({
    args: {},
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }
        // console.log(identity.tokenIdentifier);
        //gentle-tarpon-23.clerk.accounts.dev|user_2vMLugBwx6JJF2E23CgI13e0dxO
        //gentle-tarpon-23.clerk.accounts.dev|user_2vMXCos222aQDA6vwmFf9v1NFr9

        /*  const user = await ctx.db
             .query("users")
             .withIndex("by_tokenIdentifier", (q) =>
                 q.eq("tokenIdentifier", identity.tokenIdentifier)
             )
             .unique();
 
         // console.log(user) */
        const cleanToken = identity.tokenIdentifier.replace(/^https?:\/\//, "");

        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) =>
                q.eq("tokenIdentifier", cleanToken)
            )
            .unique();
        // console.log(user)

        if (!user) {
            throw new ConvexError("User not found");
        }

        return user;
    },
});



export const getGroupMembers = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();

        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        const conversation = await ctx.db
            .query("conversations")
            .filter((q) => q.eq(q.field("_id"), args.conversationId))
            .first();
        if (!conversation) {
            throw new ConvexError("Conversation not found");
        }

        const users = await ctx.db.query("users").collect();
        const groupMembers = users.filter((user) => conversation.participants.includes(user._id));

        return groupMembers;
    },
});


export const getUserByClerkId = query({
    args: {
        tokenIdentifier: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) =>
                q.eq("tokenIdentifier", args.tokenIdentifier)
            )
            .first();

        return user;
    },
});

export const getUserById = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) throw new ConvexError("User not found");
        return user;
    },
});


export const getUserByToken = query({
    args: { tokenIdentifier: v.string() },
    handler: async (ctx, { tokenIdentifier }) => {
        return await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) =>
                q.eq("tokenIdentifier", tokenIdentifier)
            )
            .unique();
    },
});

// export const updateUser = mutation({
//     args: {
//         id: v.id("users"),
//         name: v.string(),
//         email: v.string(),
//     },
//     handler: async (ctx, args) => {
//         const { id, name, email } = args;
//         await ctx.db.patch(id, { name, email });
//         return { success: true };
//     },
// });

export const deleteUser = mutation({
    args: { id: v.id("users") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    },
});


export const editUser = mutation({
    args: {
        id: v.id("users"),
        name: v.optional(v.string()),
        email: v.optional(v.string()),
        image: v.optional(v.string()),
        isAdmin: v.optional(v.boolean()),
        role: v.optional(v.union(v.literal("client"), v.literal("user"), v.literal("programmer"))),
        isOnline: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        const existingUser = await ctx.db.get(id);
        if (!existingUser) {
            throw new Error("User not found");
        }

        await ctx.db.patch(id, updates);
        return { success: true };
    },
});