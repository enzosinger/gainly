import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { requireCurrentUserId, requireRoutine } from "./lib";
import { buildRoutineExercisePositionUpdates } from "./routineExerciseOrdering";
import { hydrateRoutine } from "./routineStructure";

export const reorder = mutation({
  args: {
    routineId: v.id("routines"),
    routineExerciseIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const routine = await requireRoutine(ctx, userId, args.routineId);
    const exerciseRows = await ctx.db
      .query("routineExercises")
      .withIndex("by_user_routine_position", (q) => q.eq("userId", userId).eq("routineId", routine._id))
      .collect();
    const positionUpdates = buildRoutineExercisePositionUpdates(exerciseRows, args.routineExerciseIds);
    const now = Date.now();

    await Promise.all(
      positionUpdates.map((update) =>
        ctx.db.patch(update.routineExerciseId, {
          position: update.position,
          updatedAt: now,
        }),
      ),
    );

    await ctx.db.patch(routine._id, { updatedAt: now });

    return await hydrateRoutine(ctx, { ...routine, updatedAt: now });
  },
});
