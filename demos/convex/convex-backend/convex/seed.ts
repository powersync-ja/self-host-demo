import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const seedLists = mutation({
  args: {
    count: v.number(),
  },
  handler: async (ctx, args) => {
    const batchSize = 100;
    let inserted = 0;

    while (inserted < args.count) {
      const batch = Math.min(batchSize, args.count - inserted);
      const promises = [];

      for (let i = 0; i < batch; i++) {
        const index = inserted + i + 1;
        promises.push(
          ctx.db.insert("lists", {
            name: `List ${index}`,
            owner: "demo",
            archived: 0,
          })
        );
      }

      await Promise.all(promises);
      inserted += batch;
    }

    return { inserted };
  },
});
