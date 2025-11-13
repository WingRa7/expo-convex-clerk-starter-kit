import { action } from "./_generated/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { v } from "convex/values";

export const verifyPassword = action({
  args: {
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    try {
      await clerkClient.users.verifyPassword({
        userId: identity.subject,
        password: args.password,
      });

      return { verified: true };
    } catch (error: any) {
      return {
        verified: false,
        error:
          error?.errors?.[0]?.longMessage ||
          error?.message ||
          "Password verification failed",
      };
    }
  },
});
