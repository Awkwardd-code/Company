import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// Define the project schema
export const projectSchema = {
  userId: v.id("users"),
  name: v.string(),
  url: v.string(),
  coverImage: v.optional(v.string()),
  createdAt: v.optional(v.number()),
  updatedAt: v.optional(v.number()),
};

// Fetch all projects
export const getProjects = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("projects").collect();
    },
});

// Fetch projects by userId
export const getByUserId = query({
    args: { userId: v.id("users") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("projects")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .collect();
    },
});

// Create a new project
export const createProject = mutation({
    args: {
        userId: v.id("users"),
        name: v.string(),
        url: v.string(),
        coverImage: v.optional(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        const { userId, name, url, coverImage } = args;
        let coverImageUrl: string = "";
        if (coverImage) {
            coverImageUrl = (await ctx.storage.getUrl(coverImage)) ?? "";
        }
        const project = {
            userId,
            name,
            url,
            coverImage: coverImageUrl || "",
            createdAt: Date.now(),
        };
        const projectId = await ctx.db.insert("projects", project);
        return projectId;
    },
});

// Update a project by ID
export const updateProject = mutation({
    args: {
        id: v.id("projects"),
        name: v.string(),
        url: v.string(),
        coverImage: v.optional(v.id("_storage")),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {
        const { id, name, url, coverImage, userId } = args;
        const project = await ctx.db.get(id);
        if (!project) {
            throw new Error("Project not found");
        }
        let coverImageUrl: string = project.coverImage ?? "";
        if (coverImage) {
            coverImageUrl = (await ctx.storage.getUrl(coverImage)) ?? "";
        }
        const updatedProject = {
            name,
            url,
            coverImage: coverImageUrl || "",
            userId,
            createdAt: project.createdAt ?? Date.now(),
            updatedAt: Date.now(),
        };
        await ctx.db.patch(id, updatedProject);
        return { success: true };
    },
});

// Delete a project by ID
export const remove = mutation({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        const project = await ctx.db.get(args.id);
        if (!project) {
            throw new Error("Project not found");
        }
        await ctx.db.delete(args.id);
        return { success: true };
    },
});

// Generate upload URL for file uploads
export const generateUploadUrl = mutation({
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});