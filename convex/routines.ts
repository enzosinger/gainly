import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { requireCurrentUserId, requireExercise, requireRoutine } from "./lib";
import {
  addRoutineExercise,
  addRoutineSet,
  addRoutineSuperset,
  addRoutineTechnique,
  hydrateRoutine,
  removeRoutineExercise,
  removeRoutineSet,
  updateRoutineFeederSets,
  updateRoutineWarmupSets,
  writeRoutineStructure,
} from "./routineStructure";
import { deleteRoutineSummaries } from "./routineSummary";

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
    });

    const routine = await ctx.db.get(routineId);
    if (!routine) {
      throw new Error("Routine could not be created.");
    }

    await writeRoutineStructure(ctx, routine, []);
    return await hydrateRoutine(ctx, routine);
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireCurrentUserId(ctx);
    const routines = await ctx.db
      .query("routines")
      .withIndex("by_user_position", (q) => q.eq("userId", userId))
      .collect();

    return await Promise.all(routines.map((routine) => hydrateRoutine(ctx, routine)));
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

async function deleteRoutineRows(ctx: MutationCtx, userId: Id<"users">, routineId: Id<"routines">) {
  const routineExercises = await ctx.db
    .query("routineExercises")
    .withIndex("by_user_routine_position", (q) => q.eq("userId", userId).eq("routineId", routineId))
    .collect();
  const routineExerciseSets = await ctx.db
    .query("routineExerciseSets")
    .withIndex("by_user_routine_position", (q) => q.eq("userId", userId).eq("routineId", routineId))
    .collect();
  const sessions = await ctx.db
    .query("workoutSessions")
    .withIndex("by_user_routine_weekStart", (q) => q.eq("userId", userId).eq("routineId", routineId))
    .collect();

  for (const session of sessions) {
    const sessionExercises = await ctx.db
      .query("workoutSessionExercises")
      .withIndex("by_user_session_position", (q) => q.eq("userId", userId).eq("sessionId", session._id))
      .collect();
    const sessionSets = await ctx.db
      .query("workoutSessionSets")
      .withIndex("by_user_session_publicId", (q) => q.eq("userId", userId).eq("sessionId", session._id))
      .collect();

    await Promise.all(sessionSets.map((set) => ctx.db.delete(set._id)));
    await Promise.all(sessionExercises.map((exercise) => ctx.db.delete(exercise._id)));
    await ctx.db.delete(session._id);
  }

  await Promise.all(routineExerciseSets.map((set) => ctx.db.delete(set._id)));
  await Promise.all(routineExercises.map((exercise) => ctx.db.delete(exercise._id)));
  await deleteRoutineSummaries(ctx, userId, routineId);
}

export const remove = mutation({
  args: {
    routineId: v.id("routines"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    await requireRoutine(ctx, userId, args.routineId);

    await deleteRoutineRows(ctx, userId, args.routineId);
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

    return await addRoutineExercise(ctx, routine, args.exerciseId);
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
    return await addRoutineSet(ctx, routine, args.routineExerciseId);
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
    return await addRoutineTechnique(ctx, routine, args.routineExerciseId, args.technique);
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

    return await addRoutineSuperset(ctx, routine, args.exerciseId, args.pairExerciseId);
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
    return await removeRoutineExercise(ctx, routine, args.routineExerciseId);
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
    return await removeRoutineSet(ctx, routine, args.routineExerciseId, args.setId);
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
    return await updateRoutineWarmupSets(ctx, routine, args.routineExerciseId, args.warmupSets);
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
    return await updateRoutineFeederSets(ctx, routine, args.routineExerciseId, args.feederSets);
  },
});
