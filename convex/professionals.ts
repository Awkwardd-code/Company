import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Professional schema
export const professionalSchema = {
  bio: v.string(),
  userId: v.id("users"),
  image: v.string(), // Assuming this is already a URL, not storage ID
  designations: v.array(v.id("designations")),
};

// Get all professionals
export const get = query({
  handler: async (ctx) => {
    const professionals = await ctx.db.query("professionals").collect();
    return professionals;
  },
});

// Get a single professional by userId
export const getByUserId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const professional = await ctx.db
      .query("professionals")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .first();
    return professional;
  },
});

// Add a new professional
export const add = mutation({
  args: {
    bio: v.string(),
    userId: v.id("users"),
    image: v.id("_storage"), // Uploading the image first, then getting URL
    designations: v.array(v.id("designations")),
  },
  handler: async (ctx, args) => {
    const imageUrl = (await ctx.storage.getUrl(args.image)) as string;
    const professional = {
      bio: args.bio,
      userId: args.userId,
      image: imageUrl,
      designations: args.designations,
    };
    const professionalId = await ctx.db.insert("professionals", professional);
    return professionalId;
  },
});

// Update an existing professional
export const update = mutation({
  args: {
    id: v.id("professionals"),
    bio: v.optional(v.string()),
    image: v.optional(v.id("_storage")), // optional image upload
    designations: v.optional(v.array(v.id("designations"))),
  },
  handler: async (ctx, args) => {
    const { id, image, ...updates } = args;

    const professional = await ctx.db.get(id);
    if (!professional) {
      throw new Error("Professional not found");
    }

    // Prepare updated fields
    const updatedFields: Partial<typeof professional> = {
      ...updates,
    };

    // If image was provided, upload new image URL
    if (image) {
      const imageUrl = (await ctx.storage.getUrl(image)) as string;
      updatedFields.image = imageUrl;
    }

    await ctx.db.patch(id, updatedFields);
    return id;
  },
});


// Delete a professional
export const remove = mutation({
  args: { id: v.id("professionals") },
  handler: async (ctx, args) => {
    const professional = await ctx.db.get(args.id);
    if (!professional) {
      throw new Error("Professional not found");
    }
    await ctx.db.delete(args.id);
    return args.id;
  },
});

// Generate upload URL (for uploading professional images)
export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
