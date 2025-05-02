import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new designation
export const addDesignation = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, { title }) => {
    return await ctx.db.insert("designations", { title });
  },
});

// Get all designations
export const getDesignations = query({
  handler: async (ctx) => {
    return await ctx.db.query("designations").collect();
  },
});

// Get a designation by ID
export const getDesignationById = query({
  args: { designationId: v.id("designations") },
  handler: async (ctx, { designationId }) => {
    return await ctx.db.get(designationId);
  },
});

// Update a designation
export const updateDesignation = mutation({
  args: {
    designationId: v.id("designations"),
    title: v.string(),
  },
  handler: async (ctx, { designationId, title }) => {
    return await ctx.db.patch(designationId, { title });
  },
});

// Delete a designation
export const deleteDesignation = mutation({
  args: { designationId: v.id("designations") },
  handler: async (ctx, { designationId }) => {
    const professionals = await ctx.db.query("professionals").collect();
    for (const pro of professionals) {
      if (pro.designations.includes(designationId)) {
        const updated = pro.designations.filter(id => id !== designationId);
        await ctx.db.patch(pro._id, { designations: updated });
      }
    }

    
    await ctx.db.delete(designationId);
  },
});
