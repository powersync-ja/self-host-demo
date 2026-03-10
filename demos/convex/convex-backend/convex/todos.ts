import { mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

export const deleteBatch = mutation({
  handler: async (ctx) => {
    const todos = await ctx.db.query("todos").take(4000);
    for (const todo of todos) {
      await ctx.db.delete(todo._id);
    }
    return todos.length;
  },
});

export const deleteAll = action({
  handler: async (ctx) => {
    let total = 0;
    let deleted;
    do {
      deleted = await ctx.runMutation(api.todos.deleteBatch);
      total += deleted;
      if (deleted > 0) {
        console.log(`Deleted ${total} todos so far...`);
      }
    } while (deleted > 0);
    console.log(`Deleted ${total} todos total.`);
    return total;
  },
});

export const create = mutation({
  args: {
    // Basic fields
    source_id: v.optional(v.string()),
    created_at: v.optional(v.string()),
    completed_at: v.optional(v.union(v.null(), v.string())),
    description: v.string(),
    list_id: v.id("lists"),
    
    // All Convex datatypes for stress testing
    // String types
    title: v.string(),
    notes: v.optional(v.string()),
    category: v.optional(v.string()),
    
    // Number types
    priority: v.number(),
    estimated_hours: v.optional(v.float64()),
    progress_percentage: v.optional(v.float64()),
    
    // Boolean types
    is_urgent: v.boolean(),
    is_private: v.boolean(),
    has_attachments: v.optional(v.boolean()),
    
    // Array types
    tags: v.array(v.string()),
    dependencies: v.optional(v.array(v.id("todos"))),
    assigned_users: v.optional(v.array(v.string())),
    
    // Object types
    metadata: v.optional(v.record(v.string(), v.any())),
    custom_fields: v.optional(v.record(v.string(), v.union(v.string(), v.number(), v.boolean()))),
    
    // ID references
    parent_task_id: v.optional(v.id("todos")),
    project_id: v.optional(v.id("lists")),
    
    // Union types
    status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled")),
    difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
    
    // Null handling
    archived_at: v.optional(v.union(v.null(), v.string())),
    deleted_by: v.optional(v.union(v.null(), v.string())),
    
    // Legacy fields kept for backwards compatibility
    completed: v.optional(v.number()),
    created_by: v.optional(v.union(v.null(), v.string())),
    completed_by: v.optional(v.union(v.null(), v.string())),
    photo_id: v.optional(v.union(v.null(), v.string())),
    owner_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("todos", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("todos"),
    // Basic fields
    source_id: v.optional(v.string()),
    created_at: v.optional(v.string()),
    completed_at: v.optional(v.union(v.null(), v.string())),
    description: v.optional(v.string()),
    list_id: v.optional(v.id("lists")),
    
    // String types
    title: v.optional(v.string()),
    notes: v.optional(v.string()),
    category: v.optional(v.string()),
    
    // Number types
    priority: v.optional(v.number()),
    estimated_hours: v.optional(v.float64()),
    progress_percentage: v.optional(v.float64()),
    
    // Boolean types
    is_urgent: v.optional(v.boolean()),
    is_private: v.optional(v.boolean()),
    has_attachments: v.optional(v.boolean()),
    
    // Array types
    tags: v.optional(v.array(v.string())),
    dependencies: v.optional(v.array(v.id("todos"))),
    assigned_users: v.optional(v.array(v.string())),
    
    // Object types
    metadata: v.optional(v.record(v.string(), v.any())),
    custom_fields: v.optional(v.record(v.string(), v.union(v.string(), v.number(), v.boolean()))),
    
    // ID references
    parent_task_id: v.optional(v.id("todos")),
    project_id: v.optional(v.id("lists")),
    
    // Union types
    status: v.optional(v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled"))),
    difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
    
    // Null handling
    archived_at: v.optional(v.union(v.null(), v.string())),
    deleted_by: v.optional(v.union(v.null(), v.string())),
    
    // Legacy fields
    completed: v.optional(v.number()),
    created_by: v.optional(v.union(v.null(), v.string())),
    completed_by: v.optional(v.union(v.null(), v.string())),
    photo_id: v.optional(v.union(v.null(), v.string())),
    owner_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: {
    id: v.id("todos"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const createBatch = mutation({
  args: {
    todos: v.array(
      v.object({
        // Basic fields
        source_id: v.optional(v.string()),
        created_at: v.optional(v.string()),
        completed_at: v.optional(v.union(v.null(), v.string())),
        description: v.string(),
        list_id: v.id("lists"),
        
        // String types
        title: v.string(),
        notes: v.optional(v.string()),
        category: v.optional(v.string()),
        
        // Number types
        priority: v.number(),
        estimated_hours: v.optional(v.float64()),
        progress_percentage: v.optional(v.float64()),
        
        // Boolean types
        is_urgent: v.boolean(),
        is_private: v.boolean(),
        has_attachments: v.optional(v.boolean()),
        
        // Array types
        tags: v.array(v.string()),
        dependencies: v.optional(v.array(v.id("todos"))),
        assigned_users: v.optional(v.array(v.string())),
        
        // Object types
        metadata: v.optional(v.record(v.string(), v.any())),
        custom_fields: v.optional(v.record(v.string(), v.union(v.string(), v.number(), v.boolean()))),
        
        // ID references
        parent_task_id: v.optional(v.id("todos")),
        project_id: v.optional(v.id("lists")),
        
        // Union types
        status: v.union(v.literal("pending"), v.literal("in_progress"), v.literal("completed"), v.literal("cancelled")),
        difficulty: v.optional(v.union(v.literal("easy"), v.literal("medium"), v.literal("hard"))),
        
        // Null handling
        archived_at: v.optional(v.union(v.null(), v.string())),
        deleted_by: v.optional(v.union(v.null(), v.string())),
        
        // Legacy fields
        completed: v.optional(v.number()),
        created_by: v.optional(v.union(v.null(), v.string())),
        completed_by: v.optional(v.union(v.null(), v.string())),
        photo_id: v.optional(v.union(v.null(), v.string())),
        owner_id: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const ids = [];
    for (const todo of args.todos) {
      const id = await ctx.db.insert("todos", todo);
      ids.push(id);
    }
    return ids;
  },
});
