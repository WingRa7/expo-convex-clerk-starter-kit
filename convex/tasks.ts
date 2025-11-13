import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createTask = mutation({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    // This is the magic!
    // It proves Convex knows who the Clerk user is.
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    // Get the user's Clerk ID
    const userId = identity.subject;

    // Save the task WITH their user ID
    await ctx.db.insert("tasks", {
      text: args.text,
      userId: userId,
    });
  },
});
