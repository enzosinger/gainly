import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { requireCurrentUserId, requireExercise, requireRoutine } from "./lib";

function buildNextSetForRoutineExercise(routineExercise: {
  id: string;
  sets: Array<{ technique: "normal" | "backoff" | "cluster" | "superset"; pairExerciseId?: Id<"exercises"> }>;
}) {
  const supersetSet = routineExercise.sets.find((set) => set.technique === "superset" && set.pairExerciseId);

  if (supersetSet) {
    return {
      id: `${routineExercise.id}-set-${routineExercise.sets.length + 1}`,
      technique: "superset" as const,
      pairExerciseId: supersetSet.pairExerciseId,
    };
  }

  return {
    id: `${routineExercise.id}-set-${routineExercise.sets.length + 1}`,
    technique: "normal" as const,
  };
}

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const name = args.name.trim();

    if (!name) {
      throw new Error("Routine name is required.");
    }

    const routines = await ctx.db
      .query("routines")
      .withIndex("by_user_position", (q) => q.eq("userId", userId))
      .collect();
    const position = routines.reduce((maxPosition, routine) => Math.max(maxPosition, routine.position), -1) + 1;
    const now = Date.now();

    const routineId = await ctx.db.insert("routines", {
      userId,
      name,
      completed: false,
      deltaPercent: 0,
      position,
      createdAt: now,
      updatedAt: now,
      exercises: [],
    });

    return await ctx.db.get(routineId);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireCurrentUserId(ctx);

    return await ctx.db
      .query("routines")
      .withIndex("by_user_position", (q) => q.eq("userId", userId))
      .collect();
  },
});

export const reorder = mutation({
  args: {
    routineIds: v.array(v.id("routines")),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const routines = await ctx.db
      .query("routines")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const routineById = new Map(routines.map((routine) => [routine._id, routine]));

    await Promise.all(
      args.routineIds.map(async (routineId, index) => {
        const routine = routineById.get(routineId);
        if (!routine) {
          throw new Error("Routine not found.");
        }

        await ctx.db.patch(routineId, {
          position: index,
          updatedAt: Date.now(),
        });
      }),
    );
  },
});

export const remove = mutation({
  args: {
    routineId: v.id("routines"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    await requireRoutine(ctx, userId, args.routineId);

    const sessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_routine_weekStart", (q) =>
        q.eq("userId", userId).eq("routineId", args.routineId),
      )
      .collect();

    await Promise.all(sessions.map((session) => ctx.db.delete(session._id)));
    await ctx.db.delete(args.routineId);
  },
});

export const addExercise = mutation({
  args: {
    routineId: v.id("routines"),
    exerciseId: v.id("exercises"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const routine = await requireRoutine(ctx, userId, args.routineId);
    await requireExercise(ctx, userId, args.exerciseId);

    const nextIndex = routine.exercises.length + 1;
    const nextExercises: typeof routine.exercises = [
      ...routine.exercises,
      {
        id: `routine-item-${String(args.exerciseId)}-${nextIndex}`,
        exerciseId: args.exerciseId,
        sets: [{ id: `set-${String(args.exerciseId)}-${nextIndex}-1`, technique: "normal" }],
      },
    ];

    await ctx.db.patch(routine._id, {
      exercises: nextExercises,
      updatedAt: Date.now(),
    });
  },
});

export const addSet = mutation({
  args: {
    routineId: v.id("routines"),
    routineExerciseId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const routine = await requireRoutine(ctx, userId, args.routineId);
    const nextExercises: typeof routine.exercises = routine.exercises.map((routineExercise) => {
      if (routineExercise.id !== args.routineExerciseId) {
        return routineExercise;
      }

      return {
        ...routineExercise,
        sets: [...routineExercise.sets, buildNextSetForRoutineExercise(routineExercise)],
      };
    });

    await ctx.db.patch(routine._id, {
      exercises: nextExercises,
      updatedAt: Date.now(),
    });
  },
});

export const addTechnique = mutation({
  args: {
    routineId: v.id("routines"),
    routineExerciseId: v.string(),
    technique: v.union(v.literal("backoff"), v.literal("cluster"), v.literal("superset")),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const routine = await requireRoutine(ctx, userId, args.routineId);
    const nextExercises: typeof routine.exercises = routine.exercises.map((routineExercise) => {
      if (routineExercise.id !== args.routineExerciseId) {
        return routineExercise;
      }

      const nextSetIndex = routineExercise.sets.length + 1;
      return {
        ...routineExercise,
        sets: [
          ...routineExercise.sets,
          {
            id: `${routineExercise.id}-set-${nextSetIndex}`,
            technique: args.technique,
          },
        ],
      };
    });

    await ctx.db.patch(routine._id, {
      exercises: nextExercises,
      updatedAt: Date.now(),
    });
  },
});

export const addSuperset = mutation({
  args: {
    routineId: v.id("routines"),
    exerciseId: v.id("exercises"),
    pairExerciseId: v.id("exercises"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);

    if (args.exerciseId === args.pairExerciseId) {
      throw new Error("Superset requires two different exercises.");
    }

    const routine = await requireRoutine(ctx, userId, args.routineId);
    await requireExercise(ctx, userId, args.exerciseId);
    await requireExercise(ctx, userId, args.pairExerciseId);

    const nextIndex = routine.exercises.length + 1;
    const nextExercises: typeof routine.exercises = [
      ...routine.exercises,
      {
        id: `routine-item-${String(args.exerciseId)}-${String(args.pairExerciseId)}-${nextIndex}`,
        exerciseId: args.exerciseId,
        sets: [
          {
            id: `set-${String(args.exerciseId)}-${String(args.pairExerciseId)}-${nextIndex}-1`,
            technique: "superset",
            pairExerciseId: args.pairExerciseId,
          },
        ],
      },
    ];

    await ctx.db.patch(routine._id, {
      exercises: nextExercises,
      updatedAt: Date.now(),
    });
  },
});

export const removeExercise = mutation({
  args: {
    routineId: v.id("routines"),
    routineExerciseId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const routine = await requireRoutine(ctx, userId, args.routineId);

    await ctx.db.patch(routine._id, {
      exercises: routine.exercises.filter((routineExercise) => routineExercise.id !== args.routineExerciseId),
      updatedAt: Date.now(),
    });
  },
});

export const removeSet = mutation({
  args: {
    routineId: v.id("routines"),
    routineExerciseId: v.string(),
    setId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const routine = await requireRoutine(ctx, userId, args.routineId);

    const nextExercises = routine.exercises.map((routineExercise) => {
      if (routineExercise.id !== args.routineExerciseId) {
        return routineExercise;
      }

      return {
        ...routineExercise,
        sets: routineExercise.sets.filter((set) => set.id !== args.setId),
      };
    });

    await ctx.db.patch(routine._id, {
      exercises: nextExercises,
      updatedAt: Date.now(),
    });
  },
});

export const updateWarmupSets = mutation({
  args: {
    routineId: v.id("routines"),
    routineExerciseId: v.string(),
    warmupSets: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const routine = await requireRoutine(ctx, userId, args.routineId);
    const nextExercises = routine.exercises.map((ex) => {
      if (ex.id === args.routineExerciseId) {
        return { ...ex, warmupSets: args.warmupSets };
      }
      return ex;
    });
    await ctx.db.patch(args.routineId, { exercises: nextExercises, updatedAt: Date.now() });
  },
});

export const updateFeederSets = mutation({
  args: {
    routineId: v.id("routines"),
    routineExerciseId: v.string(),
    feederSets: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const routine = await requireRoutine(ctx, userId, args.routineId);
    const nextExercises = routine.exercises.map((ex) => {
      if (ex.id === args.routineExerciseId) {
        return { ...ex, feederSets: args.feederSets };
      }
      return ex;
    });
    await ctx.db.patch(args.routineId, { exercises: nextExercises, updatedAt: Date.now() });
  },
});
