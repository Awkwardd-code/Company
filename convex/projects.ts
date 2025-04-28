import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Fetch all projects (or filter by userId if needed)
export const getProjects = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("projects").collect();
    },
});
export const getByUserId = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("projects")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();
    },
});
export const createProject = mutation({
    args: {
        userId: v.id("users"),
        name: v.string(),
        url: v.string(),
    },
    handler: async (ctx, args) => {
        const { userId, name, url } = args;
        const projectId = await ctx.db.insert("projects", { userId, name, url });
        return projectId;
    },
});

// Update a project by ID
export const updateProject = mutation({
    args: {
        id: v.id("projects"),
        name: v.string(),
        url: v.string(),
    },
    handler: async (ctx, args) => {
        const { id, name, url } = args;
        await ctx.db.patch(id, { name, url });
        return { success: true };
    },
});

// Delete a project by ID
export const deleteProject = mutation({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
        return { success: true };
    },
});