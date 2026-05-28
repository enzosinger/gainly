import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireCurrentUserId, requireRoutine } from "./lib";
import { duplicateRoutineWithoutHistory } from "./routineDuplication";
import { hydrateRoutine, writeRoutineStructure } from "./routineStructure";

export const duplicate = mutation({
  args: {
    routineId: v.id("routines"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const sourceRoutine = await requireRoutine(ctx, userId, args.routineId);
    const hydratedSourceRoutine = await hydrateRoutine(ctx, sourceRoutine);
    const duplicateRoutine = await duplicateRoutineWithoutHistory(ctx, hydratedSourceRoutine);

    const routineId = await ctx.db.insert("routines", {
      userId,
      name: duplicateRoutine.name,
      completed: false,
      deltaPercent: 0,
      isActive: true,
      position: duplicateRoutine.position,
      createdAt: duplicateRoutine.createdAt,
      updatedAt: duplicateRoutine.updatedAt,
    });

    const routine = await ctx.db.get(routineId);
    if (!routine) {
      throw new Error("Routine could not be duplicated.");
    }

    await writeRoutineStructure(ctx, routine, duplicateRoutine.exercises);
    return await hydrateRoutine(ctx, routine);
  },
});

export const setActive = mutation({
  args: {
    routineId: v.id("routines"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    await requireRoutine(ctx, userId, args.routineId);

    await ctx.db.patch(args.routineId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });
  },
});

export const rename = mutation({
  args: {
    routineId: v.id("routines"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const routine = await requireRoutine(ctx, userId, args.routineId);
    const name = args.name.trim();

    if (!name) {
      throw new Error("Routine name is required.");
    }

    const now = Date.now();

    await ctx.db.patch(args.routineId, {
      name,
      updatedAt: now,
    });

    return await hydrateRoutine(ctx, { ...routine, name, updatedAt: now });
  },
});
