import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { requireCurrentUserId, requireExercise } from "./lib";
import { refreshRoutineSummaryDocs } from "./routineSummary";
import { seedRoutineRowsFromLegacy } from "./routineStructure";
import { seedWorkoutSessionRowsFromLegacy } from "./workoutSessionStructure";
import { exerciseDescriptionValidator, muscleGroupValidator } from "./validators";

function normalizeExerciseDescription(description?: string) {
  const trimmedDescription = description?.trim();
  return trimmedDescription ? trimmedDescription : undefined;
}

async function removeExerciseFromRoutine(
  ctx: MutationCtx,
  routine: Doc<"routines">,
  exerciseId: Id<"exercises">,
) {
  let routineExerciseRows = await ctx.db
    .query("routineExercises")
    .withIndex("by_user_routine_position", (q) => q.eq("userId", routine.userId).eq("routineId", routine._id))
    .collect();

  if (routineExerciseRows.length === 0 && routine.exercises.some((routineExercise) => routineExercise.exerciseId === exerciseId)) {
    await seedRoutineRowsFromLegacy(ctx, routine);
    routineExerciseRows = await ctx.db
      .query("routineExercises")
      .withIndex("by_user_routine_position", (q) => q.eq("userId", routine.userId).eq("routineId", routine._id))
      .collect();
  }

  const removedRoutineExerciseRows = routineExerciseRows.filter((routineExerciseRow) => routineExerciseRow.exerciseId === exerciseId);
  const nextRoutineExercises = routine.exercises.filter((routineExercise) => routineExercise.exerciseId !== exerciseId);

  if (removedRoutineExerciseRows.length === 0 && nextRoutineExercises.length === routine.exercises.length) {
    return false;
  }

  if (removedRoutineExerciseRows.length > 0) {
    const removedRoutineExercisePublicIds = new Set(removedRoutineExerciseRows.map((routineExerciseRow) => routineExerciseRow.publicId));
    const routineExerciseSetRows = await ctx.db
      .query("routineExerciseSets")
      .withIndex("by_user_routine_position", (q) => q.eq("userId", routine.userId).eq("routineId", routine._id))
      .collect();

    await Promise.all(
      routineExerciseSetRows
        .filter((setRow) => removedRoutineExercisePublicIds.has(setRow.routineExercisePublicId))
        .map((setRow) => ctx.db.delete(setRow._id)),
    );
    await Promise.all(removedRoutineExerciseRows.map((routineExerciseRow) => ctx.db.delete(routineExerciseRow._id)));

    const remainingRoutineExerciseRows = routineExerciseRows.filter(
      (routineExerciseRow) => !removedRoutineExercisePublicIds.has(routineExerciseRow.publicId),
    );
    const now = Date.now();
    await Promise.all(
      remainingRoutineExerciseRows.map((routineExerciseRow, position) =>
        ctx.db.patch(routineExerciseRow._id, {
          position,
          updatedAt: now,
        }),
      ),
    );
  }

  if (nextRoutineExercises.length !== routine.exercises.length) {
    await ctx.db.patch(routine._id, {
      exercises: nextRoutineExercises,
      updatedAt: Date.now(),
    });
  }

  return true;
}

async function removeExerciseFromSession(
  ctx: MutationCtx,
  session: Doc<"workoutSessions">,
  exerciseId: Id<"exercises">,
) {
  let sessionExerciseRows = await ctx.db
    .query("workoutSessionExercises")
    .withIndex("by_user_session_position", (q) => q.eq("userId", session.userId).eq("sessionId", session._id))
    .collect();

  if (sessionExerciseRows.length === 0 && session.exercises.some((sessionExercise) => sessionExercise.exerciseId === exerciseId)) {
    await seedWorkoutSessionRowsFromLegacy(ctx, session);
    sessionExerciseRows = await ctx.db
      .query("workoutSessionExercises")
      .withIndex("by_user_session_position", (q) => q.eq("userId", session.userId).eq("sessionId", session._id))
      .collect();
  }

  const removedSessionExerciseRows = sessionExerciseRows.filter((sessionExerciseRow) => sessionExerciseRow.exerciseId === exerciseId);
  const nextSessionExercises = session.exercises.filter((sessionExercise) => sessionExercise.exerciseId !== exerciseId);

  if (removedSessionExerciseRows.length === 0 && nextSessionExercises.length === session.exercises.length) {
    return false;
  }

  if (removedSessionExerciseRows.length > 0) {
    const removedSessionExercisePublicIds = new Set(removedSessionExerciseRows.map((sessionExerciseRow) => sessionExerciseRow.publicId));
    const sessionSetRows = await ctx.db
      .query("workoutSessionSets")
      .withIndex("by_user_session_publicId", (q) => q.eq("userId", session.userId).eq("sessionId", session._id))
      .collect();

    await Promise.all(
      sessionSetRows
        .filter((setRow) => removedSessionExercisePublicIds.has(setRow.sessionExercisePublicId))
        .map((setRow) => ctx.db.delete(setRow._id)),
    );
    await Promise.all(removedSessionExerciseRows.map((sessionExerciseRow) => ctx.db.delete(sessionExerciseRow._id)));

    const remainingSessionExerciseRows = sessionExerciseRows.filter(
      (sessionExerciseRow) => !removedSessionExercisePublicIds.has(sessionExerciseRow.publicId),
    );
    const now = Date.now();
    await Promise.all(
      remainingSessionExerciseRows.map((sessionExerciseRow, position) =>
        ctx.db.patch(sessionExerciseRow._id, {
          position,
          updatedAt: now,
        }),
      ),
    );
  }

  if (nextSessionExercises.length !== session.exercises.length) {
    await ctx.db.patch(session._id, {
      exercises: nextSessionExercises,
      updatedAt: Date.now(),
    });
  }

  return true;
}

export const list = query({
  args: {
    muscleGroup: v.optional(muscleGroupValidator),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);

    return await ctx.db
      .query("exercises")
      .withIndex(
        args.muscleGroup ? "by_user_muscleGroup_name" : "by_user_name",
        (q) =>
          args.muscleGroup
            ? q.eq("userId", userId).eq("muscleGroup", args.muscleGroup)
            : q.eq("userId", userId),
      )
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    muscleGroup: muscleGroupValidator,
    description: exerciseDescriptionValidator,
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const trimmedName = args.name.trim();
    const description = normalizeExerciseDescription(args.description);

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
      description,
      createdAt,
    });

    return await ctx.db.get(exerciseId);
  },
});

export const update = mutation({
  args: {
    exerciseId: v.id("exercises"),
    name: v.string(),
    muscleGroup: muscleGroupValidator,
    description: exerciseDescriptionValidator,
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const exercise = await requireExercise(ctx, userId, args.exerciseId);
    const trimmedName = args.name.trim();
    const description = normalizeExerciseDescription(args.description);

    if (!trimmedName) {
      throw new Error("Exercise name is required.");
    }

    const existingExercise = await ctx.db
      .query("exercises")
      .withIndex("by_user_name", (q) => q.eq("userId", userId).eq("name", trimmedName))
      .unique();

    if (existingExercise && existingExercise._id !== exercise._id) {
      throw new Error("Exercise name already exists.");
    }

    await ctx.db.patch(exercise._id, {
      name: trimmedName,
      muscleGroup: args.muscleGroup,
      description,
    });

    return await ctx.db.get(exercise._id);
  },
});

export const remove = mutation({
  args: {
    exerciseId: v.id("exercises"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const exercise = await requireExercise(ctx, userId, args.exerciseId);

    const routines = await ctx.db
      .query("routines")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const routine of routines) {
      await removeExerciseFromRoutine(ctx, routine, exercise._id);
    }

    const sessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const session of sessions) {
      const changed = await removeExerciseFromSession(ctx, session, exercise._id);
      if (!changed || session.status !== "completed") {
        continue;
      }

      const refreshedSession = await ctx.db.get(session._id);
      if (!refreshedSession) {
        throw new Error("Workout session not found.");
      }

      await refreshRoutineSummaryDocs(ctx, refreshedSession);
    }

    await ctx.db.delete(exercise._id);
  },
});
