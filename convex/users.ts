import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";



export const createUser = internalMutation({
    args: {
        tokenIdentifier: v.string(),
        email: v.string(),
        name: v.string(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if the email already exists in the database
        const existingUser = await ctx.db.query("users").filter(q => q.eq("email", args.email)).first();

        if (existingUser) {
            throw new Error("Email is already registered.");
        }

        // If email doesn't exist, insert the new user
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


export const getAuthorDetails = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        const user = await ctx.db.get(args.userId);
        if (!user) return null;
        return {
            _id: user._id,
            name: user.name,
            role: user.role, // Ensure role is included
        };
    },
});

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



export const setUserOnline = internalMutation({
    args: { tokenIdentifier: v.string() },
    handler: async (ctx, args) => {
        const cleanToken = args.tokenIdentifier.replace(/^https?:\/\//, "");

        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) =>
                q.eq("tokenIdentifier", cleanToken)
            )
            .unique();



        if (!user) {
            throw new ConvexError("User not found");
        }

        await ctx.db.patch(user._id, { isOnline: true });
    },
});

export const setUserOffline = internalMutation({
    args: { tokenIdentifier: v.string() },
    handler: async (ctx, args) => {
        const cleanToken = args.tokenIdentifier.replace(/^https?:\/\//, "");

        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) =>
                q.eq("tokenIdentifier", cleanToken)
            )
            .unique();
            
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
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new ConvexError("Unauthorized");
        }

        const cleanToken = identity.tokenIdentifier.replace(/^https?:\/\//, "");

        const user = await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", (q) =>
                q.eq("tokenIdentifier", cleanToken)
            )
            .unique();
        return user;
    },
});


export const getByToken = query({
    args: { tokenIdentifier: v.string() },
    handler: async (ctx, { tokenIdentifier }) => {
        return await ctx.db
            .query("users")
            .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", tokenIdentifier))
            .unique();
    }
});



export const getProgrammers = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("role"), "programmer"))
            .collect();
    },
});


export const deleteUserWithRelations = mutation({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        try {
            // 1. Delete related projects
            const projects = await ctx.db
                .query("projects")
                .filter((q) => q.eq(q.field("userId"), userId))
                .collect();
            for (const project of projects) {
                await ctx.db.delete(project._id);
            }

            // 2. Delete professional profile
            const professional = await ctx.db
                .query("professionals")
                .filter((q) => q.eq(q.field("userId"), userId))
                .unique();
            if (professional) {
                await ctx.db.delete(professional._id);
            }

            // 3. Delete authored blogs
            const blogs = await ctx.db
                .query("blogs")
                .filter((q) => q.eq(q.field("authorId"), userId))
                .collect();
            for (const blog of blogs) {
                await ctx.db.delete(blog._id);
            }

            // 4. Remove user from conversations (and handle admin)
            const conversations = await ctx.db.query("conversations").collect();
            const userConversations = conversations.filter((convo) =>
                convo.participants.includes(userId)
            );

            for (const convo of userConversations) {
                const updatedParticipants = convo.participants.filter((pid) => pid !== userId);

                // Initialize updates with just participants
                const updates: Partial<{
                    participants: Id<"users">[];
                    admin?: Id<"users">;
                }> = {
                    participants: updatedParticipants,
                };

                // Only reassign admin if there's at least one other participant
                if (convo.admin === userId && updatedParticipants.length > 0) {
                    updates.admin = updatedParticipants[0];
                }

                if (updatedParticipants.length === 0) {
                    await ctx.db.delete(convo._id);
                } else {
                    await ctx.db.patch(convo._id, updates);
                }
            }


            // 5. Delete interviews where user is a candidate
            const candidateInterviews = await ctx.db
                .query("interviews")
                .filter((q) => q.eq(q.field("candidateId"), userId))
                .collect();
            for (const interview of candidateInterviews) {
                await ctx.db.delete(interview._id);
            }

            // 6. Remove user from interviewer lists
            const interviews = await ctx.db.query("interviews").collect();
            const userInterviews = interviews.filter((interview) =>
                interview.interviewerIds.includes(userId)
            );
            for (const interview of userInterviews) {
                const updatedIds = interview.interviewerIds.filter((id) => id !== userId);
                await ctx.db.patch(interview._id, { interviewerIds: updatedIds });
            }

            // 7. Delete messages sent by this user
            const messages = await ctx.db
                .query("messages")
                .filter((q) => q.eq(q.field("sender"), userId))
                .collect();
            for (const message of messages) {
                await ctx.db.delete(message._id);
            }

            // 8. Delete the user record
            await ctx.db.delete(userId);
        } catch (error) {
            console.error(`Failed to delete user ${userId}:`, error);
            // throw new Error(`User deletion failed: ${error.message}`);
        }
    },
});
