// convex/functions/professionals.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new professional profile
export const addProfessional = mutation({
  args: {
    bio: v.string(),
    userId: v.id("users"),
    designations: v.array(v.id("designations")),
  },
  handler: async (ctx, { bio, userId, designations }) => {
    return await ctx.db.insert("professionals", {
      bio,
      userId,
      designations,
    });
  },
});

// Get all professionals
export const getProfessionals = query({
  handler: async (ctx) => {
    return await ctx.db.query("professionals").collect();
  },
});

// Get a professional by ID
export const getProfessionalById = query({
  args: { professionalId: v.id("professionals") },
  handler: async (ctx, { professionalId }) => {
    return await ctx.db.get(professionalId);
  },
});

// Update a professional's profile
export const updateProfessional = mutation({
  args: {
    professionalId: v.id("professionals"),
    bio: v.string(),
    designations: v.array(v.id("designations")),
  },
  handler: async (ctx, { professionalId, bio, designations }) => {
    return await ctx.db.patch(professionalId, {
      bio,
      designations,
    });
  },
});

// Delete a professional profile
export const deleteProfessional = mutation({
  args: { professionalId: v.id("professionals") },
  handler: async (ctx, { professionalId }) => {
    return await ctx.db.delete(professionalId);
  },
});
