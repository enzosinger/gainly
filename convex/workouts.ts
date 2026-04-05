import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { requireCurrentUserId, requireRoutine, requireWorkoutSession } from "./lib";
import {
  completeWorkoutSession,
  createWorkoutSessionFromRoutine,
  hydrateWorkoutSession,
  syncWorkoutSessionWithRoutine,
  updateWorkoutSessionSet,
} from "./workoutSessionStructure";
import { listProgressSummaries, listWeeklyRoutineSummaries } from "./routineSummary";
import { refreshRoutineSummaryDocs } from "./routineSummary";

const workoutSetPatchValidator = v.object({
  sessionId: v.id("workoutSessions"),
  setId: v.string(),
  weightKg: v.optional(v.union(v.number(), v.null())),
  reps: v.optional(v.union(v.number(), v.null())),
  pairWeightKg: v.optional(v.union(v.number(), v.null())),
  pairReps: v.optional(v.union(v.number(), v.null())),
});

function buildSessionEntityId(prefix: string, parts: string[]) {
  return `${prefix}-${parts.join("-")}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildSessionSet(
  routineExerciseId: string,
  set: Doc<"routines">["exercises"][number]["sets"][number],
  index: number,
) {
  return {
    id: buildSessionEntityId("session-set", [routineExerciseId, String(index + 1)]),
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
    id: buildSessionEntityId("session-exercise", [routineExercise.id, String(index + 1)]),
    routineExerciseId: routineExercise.id,
    exerciseId: routineExercise.exerciseId,
    position: index,
    sets: routineExercise.sets.map((set, setIndex) => buildSessionSet(routineExercise.id, set, setIndex)),
    warmupSets: routineExercise.warmupSets,
    feederSets: routineExercise.feederSets,
  };
}

function syncSessionSetWithRoutineSet(
  existingSessionSet: Doc<"workoutSessions">["exercises"][number]["sets"][number],
  routineSet: Doc<"routines">["exercises"][number]["sets"][number],
) {
  return {
    ...existingSessionSet,
    technique: routineSet.technique,
    backoffPercent: routineSet.backoffPercent,
    clusterBlocks: routineSet.clusterBlocks,
    clusterRepRange: routineSet.clusterRepRange,
    pairExerciseId: routineSet.pairExerciseId,
    pairWeightKg: existingSessionSet.pairWeightKg ?? routineSet.pairWeightKg,
    pairReps: existingSessionSet.pairReps ?? routineSet.pairReps,
  };
}

export function syncSessionWithRoutine(
  existingExercises: Doc<"workoutSessions">["exercises"],
  routine: Doc<"routines">,
) {
  const sessionExercisesByRoutineId = new Map(existingExercises.map((ex) => [ex.routineExerciseId, ex]));

  const syncedExercises = routine.exercises.map((routineExercise, index) => {
    const existingSessionEx = sessionExercisesByRoutineId.get(routineExercise.id);

    if (existingSessionEx) {
      const sessionSetsByTemplateId = new Map(existingSessionEx.sets.map((s) => [s.templateSetId, s]));

      const syncedSets = routineExercise.sets.map((routineSet, setIndex) => {
        const existingSessionSet = sessionSetsByTemplateId.get(routineSet.id);

        if (existingSessionSet) {
          return syncSessionSetWithRoutineSet(existingSessionSet, routineSet);
        }

        return buildSessionSet(routineExercise.id, routineSet, setIndex);
      });

      return {
        ...existingSessionEx,
        position: index,
        sets: syncedSets,
        warmupSets: routineExercise.warmupSets,
        feederSets: routineExercise.feederSets,
      };
    }

    return buildSessionExercise(routineExercise, index);
  });

  return syncedExercises;
}

export const sessionForRoutineWeek = query({
  args: {
    routineId: v.id("routines"),
    weekStart: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const session = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_routine_weekStart", (q) =>
        q.eq("userId", userId).eq("routineId", args.routineId).eq("weekStart", args.weekStart),
      )
      .first();

    return session ? await hydrateWorkoutSession(ctx, session) : null;
  },
});

export const latestCompletedSessionForRoutine = query({
  args: {
    routineId: v.id("routines"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const session = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_routine_status_weekStart", (q) =>
        q.eq("userId", userId).eq("routineId", args.routineId).eq("status", "completed"),
      )
      .order("desc")
      .first();

    return session ? await hydrateWorkoutSession(ctx, session) : null;
  },
});

export const previousHistoryForRoutine = query({
  args: {
    routineId: v.id("routines"),
    weekStart: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);

    let latestCompletedSession: Doc<"workoutSessions"> | null = null;
    for await (const session of ctx.db
      .query("workoutSessions")
      .withIndex("by_user_routine_status_weekStart", (q) =>
        q.eq("userId", userId).eq("routineId", args.routineId).eq("status", "completed"),
      )
      .order("desc")) {
      if ((session.weekStart ?? 0) < args.weekStart) {
        latestCompletedSession = session;
        break;
      }
    }

    return {
      routineId: args.routineId,
      latestCompletedSession: latestCompletedSession ? await hydrateWorkoutSession(ctx, latestCompletedSession) : null,
    };
  },
});

export const weeklyRoutineSummaries = query({
  args: {
    weekStart: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    return await listWeeklyRoutineSummaries(ctx, userId, args.weekStart);
  },
});

export const progressSummaries = query({
  args: {},
  handler: async (ctx) => {
    const userId = await requireCurrentUserId(ctx);
    const summaries = await listProgressSummaries(ctx, userId);

    return summaries.map((summary) => ({
      routineId: summary.routineId,
      hasHistory: summary.hasHistory,
      deltaPercent: summary.deltaPercent,
      lastCompletedAt: summary.lastCompletedAt,
    }));
  },
});

export const ensureSessionForRoutineWeek = mutation({
  args: {
    routineId: v.id("routines"),
    weekStart: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const existingSession = await ctx.db
      .query("workoutSessions")
      .withIndex("by_user_routine_weekStart", (q) =>
        q.eq("userId", userId).eq("routineId", args.routineId).eq("weekStart", args.weekStart),
      )
      .first();

    const routine = await requireRoutine(ctx, userId, args.routineId);

    if (existingSession) {
      const syncedSession = await syncWorkoutSessionWithRoutine(ctx, existingSession, routine);
      if (syncedSession.status === "completed") {
        await refreshRoutineSummaryDocs(ctx, syncedSession);
      }
      return syncedSession;
    }

    const now = Date.now();
    return await createWorkoutSessionFromRoutine(ctx, routine, args.weekStart, now);
  },
});

export const updateWorkoutSet = mutation({
  args: workoutSetPatchValidator,
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const session = await requireWorkoutSession(ctx, userId, args.sessionId);

    const updatedSession = await updateWorkoutSessionSet(ctx, session, args.setId, args);
    if (updatedSession.status === "completed") {
      await refreshRoutineSummaryDocs(ctx, updatedSession);
    }
  },
});

export const completeSession = mutation({
  args: {
    sessionId: v.id("workoutSessions"),
  },
  handler: async (ctx, args) => {
    const userId = await requireCurrentUserId(ctx);
    const session = await requireWorkoutSession(ctx, userId, args.sessionId);

    return await completeWorkoutSession(ctx, session);
  },
});
