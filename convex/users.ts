import { v } from "convex/values";
import {
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";

/**
 * Create or update user profile when Clerk user signs in
 * Called internally when user first authenticates
 */
// Triggering re-sync of Convex functions
export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    const clerkId = identity.subject;
    const email = identity.email || "";
    const name = identity.name || "";
    const username = identity.nickname || "";
    const imageUrl = identity.pictureUrl || "";

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: email,
        name: name,
        username: username,
        imageUrl: imageUrl,
        updatedAt: Date.now(),
      });
      return existingUser._id;
    }

    // Create new user
    const now = Date.now();
    return await ctx.db.insert("users", {
      clerkId: clerkId,
      email: email,
      name: name,
      username: username,
      imageUrl: imageUrl,
      createdAt: now,
      updatedAt: now,
      onboardingCompleted: false, // Default value
    });
  },
});

/**
 * Get current user's profile
 */
export const getCurrentUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
  },
});

/**
 * Get user by ID
 */
export const getUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

/**
 * Get user by Clerk ID
 */
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

/**
 * Update current user's profile
 */
export const updateUser = mutation({
  args: {
    name: v.optional(v.string()),
    username: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      ...args,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Mark onboarding as completed for the current user
 */
export const completeOnboarding = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      onboardingCompleted: true,
      updatedAt: Date.now(),
    });
  },
});

 
