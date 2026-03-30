import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireCurrentUserId, requireRoutine } from "./lib";
import type { Doc } from "./_generated/dataModel";

const workoutSetPatchValidator = v.object({
  sessionId: v.id("workoutSessions"),
  setId: v.string(),
  weightKg: v.optional(v.union(v.number(), v.null())),
  reps: v.optional(v.union(v.number(), v.null())),
  pairWeightKg: v.optional(v.union(v.number(), v.null())),
  pairReps: v.optional(v.union(v.number(), v.null())),
});

function createSessionEntityId(prefix: string, parts: string[]) {
  return `${prefix}-${parts.join("-")}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildSessionSet(
  routineExerciseId: string,
  set: Doc<"routines">["exercises"][number]["sets"][number],
  index: number,
) {
  return {
    id: createSessionEntityId("session-set", [routineExerciseId, String(index + 1)]),
    templateSetId: set.id,
    technique: set.technique,
    backoffPercent: set.backoffPercent,
    clusterBlocks: set.clusterBlocks,
    clusterRepRange: set.clusterRepRange,
    pairExerciseId: set.pairExerciseId,
    pairWeightKg: set.pairWeightKg,
    pairReps: set.pairReps,
  };
}

function buildSessionExercise(
  routineExercise: Doc<"routines">["exercises"][number],
  index: number,
) {
  return {
    id: createSessionEntityId("session-exercise", [routineExercise.id, String(index + 1)]),
    routineExerciseId: routineExercise.id,
    exerciseId: routineExercise.exerciseId,
    position: index,
    sets: routineExercise.sets.map((set, setIndex) => buildSessionSet(routineExercise.id, set, setIndex)),
  };
}

function buildWorkoutSession(routine: Doc<"routines">, now: number) {
  return {
    userId: routine.userId,
    routineId: routine._id,
    status: "in_progress" as const,
    startedAt: now,
    updatedAt: now,
    exercises: routine.exercises.map((exercise, index) => buildSessionExercise(exercise, index)),
  };
}

function sumSetScore(set: {
  weightKg?: number;
  reps?: number;
  pairWeightKg?: number;
  pairReps?: number;
}) {
  const scoreSide = (weight?: number, reps?: number) => {
    if (weight != null && reps != null) {
      return weight * reps;
    }

    if (weight != null) {
      return weight;
    }

    if (reps != null) {
      return reps;
    }

    return 0;
  };

  return scoreSide(set.weightKg, set.reps) + scoreSide(set.pairWeightKg, set.pairReps);
}

function sumSessionScore(session: {
  exercises: Array<{
    sets: Array<{
      weightKg?: number;
      reps?: number;
      pairWeightKg?: number;
      pairReps?: number;
    }>;
  }>;
}) {
  return session.exercises.reduce(
    (sessionTotal, exercise) =>
      sessionTotal + exercise.sets.reduce((exerciseTotal, set) => exerciseTotal + sumSetScore(set), 0),
    0,
  );
}

function calculateDeltaPercent(latestScore: number, previousScore: number) {
  if (previousScore <= 0) {
    return null;
  }

  return ((latestScore - previousScore) / previousScore) * 100;
}

function getWeekRange(weekStart: number, weekEndExclusive: number) {
  return {
    weekStart,
    weekEndExclusive,
  };
}

function cloneUpdatedSessionSet(
  set: Doc<"workoutSessions">["exercises"][number]["sets"][number],
  patch: {
    weightKg?: number | null;
    reps?: number | null;
    pairWeightKg?: number | null;
    pairReps?: number | null;
  },
) {
  const nextSet = {
    ...set,
    ...(patch.weightKg === null ? { weightKg: undefined } : patch.weightKg !== undefined ? { weightKg: patch.weightKg } : {}),
    ...(patch.reps === null ? { reps: undefined } : patch.reps !== undefined ? { reps: patch.reps } : {}),
    ...(patch.pairWeightKg === null
      ? { pairWeightKg: undefined }
      : patch.pairWeightKg !== undefined
        ? { pairWeightKg: patch.pairWeightKg }
        : {}),
    ...(patch.pairReps === null
      ? { pairReps: undefined }
      : patch.pairReps !== undefined
        ? { pairReps: patch.pairReps }
        : {}),
  };

  return Object.fromEntries(Object.entries(nextSet).filter(([, value]) => value !== undefined)) as typeof nextSet;
}

export const activeSessionForRoutine = query({
  args: {
    routineId: v.id("routines"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);

    return await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_routine_status", (q) =>
        q.eq("userId", userId).eq("routineId", args.routineId).eq("status", "in_progress"),
      )
      .first();
  },
});

export const latestCompletedSessionForRoutine = query({
  args: {
    routineId: v.id("routines"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);

    return await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_routine_status_completedAt", (q) =>
        q.eq("userId", userId).eq("routineId", args.routineId).eq("status", "completed"),
      )
      .order("desc")
      .first();
  },
});

export const weekHistoryForRoutine = query({
  args: {
    routineId: v.id("routines"),
    weekStart: v.number(),
    weekEndExclusive: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const { weekStart, weekEndExclusive } = getWeekRange(args.weekStart, args.weekEndExclusive);

    const completedSessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_routine_status_completedAt", (q) =>
        q
          .eq("userId", userId)
          .eq("routineId", args.routineId)
          .eq("status", "completed")
          .gte("completedAt", weekStart)
          .lt("completedAt", weekEndExclusive),
      )
      .order("desc")
      .collect();

    return {
      routineId: args.routineId,
      latestCompletedSession: completedSessions[0] ?? null,
      previousCompletedSession: completedSessions[1] ?? null,
      hasHistory: completedSessions.length > 1,
    };
  },
});

export const weeklyRoutineSummaries = query({
  args: {
    weekStart: v.number(),
    weekEndExclusive: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const { weekStart, weekEndExclusive } = getWeekRange(args.weekStart, args.weekEndExclusive);
    const routines = await ctx.db
      .query("routines")
      .withIndex("by_user_position", (q) => q.eq("userId", userId))
      .collect();

    const completedSessions = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_status_completedAt", (q) =>
        q.eq("userId", userId).eq("status", "completed").gte("completedAt", weekStart).lt("completedAt", weekEndExclusive),
      )
      .order("desc")
      .collect();

    const sessionsByRoutineId = new Map<
      string,
      Array<{
        exercises: Array<{
          sets: Array<{
            weightKg?: number;
            reps?: number;
            pairWeightKg?: number;
            pairReps?: number;
          }>;
        }>;
        completedAt?: number;
        updatedAt: number;
      }>
    >();

    for (const session of completedSessions) {
      const routineSessions = sessionsByRoutineId.get(String(session.routineId)) ?? [];
      routineSessions.push(session);
      sessionsByRoutineId.set(String(session.routineId), routineSessions);
    }

    return routines.map((routine) => {
      const routineSessions = sessionsByRoutineId.get(String(routine._id)) ?? [];
      const latestSession = routineSessions[0];
      const previousSession = routineSessions[1];
      const latestScore = latestSession ? sumSessionScore(latestSession) : 0;
      const previousScore = previousSession ? sumSessionScore(previousSession) : 0;
      const hasHistory = Boolean(previousSession);

      return {
        routineId: routine._id,
        completed: Boolean(latestSession),
        hasHistory,
        deltaPercent: previousSession ? calculateDeltaPercent(latestScore, previousScore) ?? 0 : 0,
        lastCompletedAt: latestSession?.completedAt ?? latestSession?.updatedAt,
      };
    });
  },
});

export const progressSummaries = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireCurrentUserId(ctx);
    const routines = await ctx.db
      .query("routines")
      .withIndex("by_user_position", (q) => q.eq("userId", userId))
      .collect();

    const summaries = await Promise.all(
      routines.map(async (routine) => {
        const routineSessions = await ctx.db
          .query("workoutSessions")
          .withIndex("by_user_routine_status_completedAt", (q) =>
            q.eq("userId", userId).eq("routineId", routine._id).eq("status", "completed"),
          )
          .order("desc")
          .collect();

        const latestSession = routineSessions[0];
        if (!latestSession) {
          return null;
        }

        const previousSession = routineSessions[1];
        const latestScore = sumSessionScore(latestSession);
        const previousScore = previousSession ? sumSessionScore(previousSession) : 0;

        return {
          routineId: routine._id,
          hasHistory: Boolean(previousSession),
          deltaPercent: previousSession ? calculateDeltaPercent(latestScore, previousScore) ?? 0 : 0,
          lastCompletedAt: latestSession.completedAt ?? latestSession.updatedAt,
        };
      }),
    );

    return summaries.filter(
      (summary): summary is NonNullable<(typeof summaries)[number]> => summary !== null,
    );
  },
});

export const ensureActiveSession = mutation({
  args: {
    routineId: v.id("routines"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const existingSession = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_routine_status", (q) =>
        q.eq("userId", userId).eq("routineId", args.routineId).eq("status", "in_progress"),
      )
      .first();

    if (existingSession) {
      return existingSession;
    }

    const routine = await requireRoutine(ctx, userId, args.routineId);
    const now = Date.now();
    return await ctx.db.insert("workoutSessions", buildWorkoutSession(routine, now));
  },
});

export const updateWorkoutSet = mutation({
  args: workoutSetPatchValidator,
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const session = await ctx.db.get(args.sessionId);

    if (!session || session.userId !== userId) {
      throw new Error("Workout session not found.");
    }

    if (session.status !== "in_progress") {
      throw new Error("Workout session is already completed.");
    }

    const nextExercises = session.exercises.map((exercise) => {
      const nextSets = exercise.sets.map((set) => {
        if (set.id !== args.setId) {
          return set;
        }

        return cloneUpdatedSessionSet(set, args);
      });

      return {
        ...exercise,
        sets: nextSets,
      };
    });

    await ctx.db.patch(args.sessionId, {
      exercises: nextExercises,
      updatedAt: Date.now(),
    });
  },
});

export const completeSession = mutation({
  args: {
    sessionId: v.id("workoutSessions"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const session = await ctx.db.get(args.sessionId);

    if (!session || session.userId !== userId) {
      throw new Error("Workout session not found.");
    }

    if (session.status === "completed") {
      return session;
    }

    const now = Date.now();
    await ctx.db.patch(args.sessionId, {
      status: "completed",
      completedAt: now,
      updatedAt: now,
    });

    return await ctx.db.get(args.sessionId);
  },
});
