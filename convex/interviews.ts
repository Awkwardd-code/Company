import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getAllInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        const interviews = await ctx.db.query("interviews").collect();

        return interviews;
    },
});

export const getMyInterviews = query({
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) return [];

        const interviews = await ctx.db
            .query("interviews")
            .withIndex("by_candidate_id", (q) => q.eq("candidateId", identity.subject))
            .collect();

        return interviews!;
    },
});

export const getInterviewByStreamCallId = query({
    args: { streamCallId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("interviews")
            .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
            .first();
    },
});

export const createInterview = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        startTime: v.number(),
        status: v.string(),
        streamCallId: v.string(),
        candidateId: v.string(),
        interviewerIds: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) throw new Error("Unauthorized");

        return await ctx.db.insert("interviews", {
            ...args,
        });
    },
});

export const updateInterviewStatus = mutation({
    args: {
        id: v.id("interviews"),
        status: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db.patch(args.id, {
            status: args.status,
            ...(args.status === "completed" ? { endTime: Date.now() } : {}),
        });
    },
});


// Mock function: Replace with your actual external API call
async function deleteStreamRoom(streamCallId: string) {
    console.log(`Deleting external stream room with ID: ${streamCallId}`);
    // Example: await fetch(`https://api.stream.com/rooms/${streamCallId}`, { method: 'DELETE' });
}

export const deleteInterview = mutation({
    args: { interviewId: v.id("interviews") },
    handler: async (ctx, { interviewId }) => {
        // 1. Get the interview
        const interview = await ctx.db.get(interviewId);
        if (!interview) {
            throw new Error("Interview not found");
        }

        // 2. Clean up external stream call (if used)
        if (interview.streamCallId) {
            await deleteStreamRoom(interview.streamCallId);
        }

        // 3. Clean up related conversations/messages if applicable (optional)
        // Example: If each interview has a conversation, you could store the conversation ID in the interview
        // const conversationId = interview.conversationId;
        // if (conversationId) {
        //   await ctx.runMutation(api.conversations.deleteConversation, { conversationId });
        // }

        // 4. Remove interview from candidate and interviewer records if needed (optional)
        // For example, update "status" or remove interview references in user metadata (not shown in schema)

        // 5. Cancel notifications or scheduled jobs (mocked)
        console.log(`Cancel any scheduled notifications or jobs for interview ${interviewId}`);

        // 6. Delete the interview
        await ctx.db.delete(interviewId);

        console.log(`Interview ${interviewId} and related resources have been cleaned up.`);
    },
});