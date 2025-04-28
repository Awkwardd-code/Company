import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Define the blog schema
export const blogSchema = {
  title: v.string(),
  slug: v.string(),
  content: v.string(),
  coverImage: v.string(),
  published: v.boolean(),
  authorId: v.id("users"),
  tags: v.optional(v.array(v.string())),
  createdAt: v.number(),
  updatedAt: v.optional(v.number()),
};

// Get all blogs
export const get = query({
  handler: async (ctx) => {
    const blogs = await ctx.db.query("blogs").collect();
    return blogs;
  },
});

// Get a single blog by slug
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const blog = await ctx.db
      .query("blogs")
      .filter((q) => q.eq(q.field("slug"), slug))
      .first();
      
    if (!blog) return null;
    return blog;
  },
});

// Add a new blog
export const add = mutation({
  args: {
    title: v.string(),
    slug: v.string(),
    content: v.string(),
    coverImage: v.id("_storage"),
    published: v.boolean(),
    authorId: v.id("users"),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const content = (await ctx.storage.getUrl(args.coverImage)) as string;
    const blog = {
      title: args.title,
      slug: args.slug,
      content: args.content,
      coverImage: content,
      published: args.published,
      authorId: args.authorId,
      tags: args.tags,
      createdAt: Date.now(),
    };
    const blogId = await ctx.db.insert("blogs", blog);
    return blogId;
  },
});

// Update an existing blog
export const update = mutation({
  args: {
    id: v.id("blogs"),
    title: v.optional(v.string()),
    slug: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.id("_storage"),
    published: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, coverImage, ...updates } = args;
    const blog = await ctx.db.get(id);
    if (!blog) {
      throw new Error("Blog not found");
    }

    const coverImageUrl = (await ctx.storage.getUrl(coverImage)) as string;

    const updatedBlog = {
      ...blog,
      ...updates,
      coverImage: coverImageUrl, // 🔥 Replace ID with the URL here
      updatedAt: Date.now(),
    };

    await ctx.db.patch(id, updatedBlog);
    return id;
  },
});


// Delete a blog
export const remove = mutation({
  args: { id: v.id("blogs") },
  handler: async (ctx, args) => {
    const blog = await ctx.db.get(args.id);
    if (!blog) {
      throw new Error("Blog not found");
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});