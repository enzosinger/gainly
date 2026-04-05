import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { requireCurrentUserId } from "./lib";
import { starterExercises, starterRoutines } from "./seed";
import { writeRoutineStructure } from "./routineStructure";

export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireCurrentUserId(ctx);
    const user = await ctx.db.get(userId);

    return user
      ? {
          id: user._id,
          name: user.name ?? null,
          email: user.email ?? null,
        }
      : null;
  },
});

export const ensureStarterData = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await requireCurrentUserId(ctx);
    const existingRoutines = await ctx.db
      .query("routines")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (existingRoutines.length > 0) {
      return { seeded: false };
    }

    const now = Date.now();
    const exerciseIdByKey = new Map<string, Id<"exercises">>();

    for (const exercise of starterExercises) {
      const exerciseId = await ctx.db.insert("exercises", {
        userId,
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        createdAt: now,
      });
      exerciseIdByKey.set(exercise.key, exerciseId);
    }

    for (const [index, routine] of starterRoutines.entries()) {
      const routineId = await ctx.db.insert("routines", {
        userId,
        name: routine.name,
        completed: routine.completed,
        deltaPercent: routine.deltaPercent,
        position: index,
        createdAt: now,
        updatedAt: now,
      });

      await writeRoutineStructure(
        ctx,
        {
          _id: routineId,
          userId,
        },
        routine.exercises.map((item) => ({
          id: item.id,
          exerciseId: exerciseIdByKey.get(item.exerciseKey)!,
          sets: item.sets.map((set) => ({
            id: set.id,
            technique: set.technique,
            weightKg: set.weightKg,
            reps: set.reps,
            backoffPercent: set.backoffPercent,
            clusterBlocks: set.clusterBlocks,
            clusterRepRange: set.clusterRepRange,
            pairExerciseId: set.pairExerciseKey ? exerciseIdByKey.get(set.pairExerciseKey) : undefined,
            pairWeightKg: set.pairWeightKg,
            pairReps: set.pairReps,
          })),
        })),
      );
    }

    return { seeded: true };
  },
});
