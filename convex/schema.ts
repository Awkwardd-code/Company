
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    isAdmin: v.boolean(),
    role: v.union(v.literal("client"), v.literal("user"), v.literal("programmer")),
    tokenIdentifier: v.string(),
    isOnline: v.boolean(),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),


  conversations: defineTable({
    participants: v.array(v.id("users")),
    isGroup: v.boolean(),
    groupName: v.optional(v.string()),
    groupImage: v.optional(v.string()),
    admin: v.optional(v.id("users")),
  }),
  designations: defineTable({
    title: v.string(),
  }),

  projects: defineTable({
    userId: v.id("users"),
    name: v.string(),
    url: v.string(),
  }),


  professionals: defineTable({
    bio: v.string(),
    userId: v.id("users"),
    designations: v.array(v.id("designations")),
  }),


  messages: defineTable({
    conversation: v.id("conversations"),
    content: v.string(),
    sender: v.string(),
    messageType: v.union(v.literal('text'), v.literal('image'), v.literal('video')),
  })
    .index("by_conversation", ["conversation"]),


  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  })
    .index("by_candidate_id", ["candidateId"])
    .index("by_stream_call_id", ["streamCallId"]),

});