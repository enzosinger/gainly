import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireCurrentUserId, requireExercise } from "./lib";
import { muscleGroupValidator } from "./validators";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireCurrentUserId(ctx);

    return await ctx.db
      .query("exercises")
      .withIndex("by_user_name", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    muscleGroup: muscleGroupValidator,
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const trimmedName = args.name.trim();

    if (!trimmedName) {
      throw new Error("Exercise name is required.");
    }

    const existingExercise = await ctx.db
      .query("exercises")
      .withIndex("by_user_name", (q) => q.eq("userId", userId).eq("name", trimmedName))
      .unique();

    if (existingExercise) {
      return existingExercise;
    }

    const createdAt = Date.now();
    const exerciseId = await ctx.db.insert("exercises", {
      userId,
      name: trimmedName,
      muscleGroup: args.muscleGroup,
      createdAt,
    });

    return await ctx.db.get(exerciseId);
  },
});

export const remove = mutation({
  args: {
    exerciseId: v.id("exercises"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    await requireExercise(ctx, userId, args.exerciseId);

    const routines = await ctx.db
      .query("routines")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    await Promise.all(
      routines.map(async (routine) => {
        const nextExercises = routine.exercises.filter((routineExercise) => routineExercise.exerciseId !== args.exerciseId);

        if (nextExercises.length === routine.exercises.length) {
          return;
        }

        await ctx.db.patch(routine._id, {
          exercises: nextExercises,
          updatedAt: Date.now(),
        });
      }),
    );

    const sessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    await Promise.all(
      sessions.map(async (session) => {
        const nextSessionExercises = session.exercises.filter((sessionExercise) => sessionExercise.exerciseId !== args.exerciseId);

        if (nextSessionExercises.length === session.exercises.length) {
          return;
        }

        await ctx.db.patch(session._id, {
          exercises: nextSessionExercises,
          updatedAt: Date.now(),
        });
      }),
    );

    await ctx.db.delete(args.exerciseId);
  },
});
