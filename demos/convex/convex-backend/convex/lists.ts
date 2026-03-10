import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    name: v.string(),
    owner_id: v.optional(v.string()),
    source_id: v.optional(v.string()),
    created_at: v.optional(v.string()),
    archived: v.optional(v.number()),
    owner: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("lists", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("lists"),
    name: v.optional(v.string()),
    owner_id: v.optional(v.string()),
    source_id: v.optional(v.string()),
    created_at: v.optional(v.string()),
    archived: v.optional(v.number()),
    owner: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: {
    id: v.id("lists"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
