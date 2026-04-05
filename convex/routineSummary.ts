import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

type SessionScoreSet = Pick<
  Doc<"workoutSessionSets">,
  "weightKg" | "reps" | "pairWeightKg" | "pairReps"
>;

function sumSetScore(set: SessionScoreSet) {
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

async function loadSessionScore(
  ctx: QueryCtx | MutationCtx,
  session: Pick<Doc<"workoutSessions">, "_id" | "userId">,
) {
  const sets = await ctx.db
    .query("workoutSessionSets")
    .withIndex("by_user_session_publicId", (q) => q.eq("userId", session.userId).eq("sessionId", session._id))
    .collect();

  return sets.reduce((total, set) => total + sumSetScore(set), 0);
}

function calculateDeltaPercent(latestScore: number, previousScore: number) {
  if (previousScore <= 0) {
    return null;
  }

  return ((latestScore - previousScore) / previousScore) * 100;
}

async function getSessionByWeekStart(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  routineId: Id<"routines">,
  weekStart: number,
) {
  return await ctx.db
    .query("workoutSessions")
    .withIndex("by_user_routine_status_weekStart", (q) =>
      q.eq("userId", userId).eq("routineId", routineId).eq("status", "completed").eq("weekStart", weekStart),
    )
    .first();
}

export async function deleteRoutineSummaries(
  ctx: MutationCtx,
  userId: Id<"users">,
  routineId: Id<"routines">,
) {
  const weekSummaries = await ctx.db
    .query("routineWeekSummaries")
    .withIndex("by_user_routine_weekStart", (q) => q.eq("userId", userId).eq("routineId", routineId))
    .collect();

  const progressSummary = await ctx.db
    .query("routineProgressSummaries")
    .withIndex("by_user_routine", (q) => q.eq("userId", userId).eq("routineId", routineId))
    .unique();

  await Promise.all(weekSummaries.map((summary) => ctx.db.delete(summary._id)));

  if (progressSummary) {
    await ctx.db.delete(progressSummary._id);
  }
}

export async function refreshRoutineSummaryDocs(
  ctx: MutationCtx,
  session: Doc<"workoutSessions">,
) {
  if (session.weekStart === undefined) {
    return;
  }

  const userId = session.userId;
  const routineId = session.routineId;
  const weekStart = session.weekStart;
  const previousWeekStart = weekStart - 604800000;

  const latestScore = await loadSessionScore(ctx, session);
  const previousWeekSession = await getSessionByWeekStart(ctx, userId, routineId, previousWeekStart);
  const previousScore = previousWeekSession ? await loadSessionScore(ctx, previousWeekSession) : 0;
  const weeklyDelta = previousWeekSession ? calculateDeltaPercent(latestScore, previousScore) ?? 0 : 0;
  const now = Date.now();

  const existingWeeklySummary = await ctx.db
    .query("routineWeekSummaries")
    .withIndex("by_user_routine_weekStart", (q) => q.eq("userId", userId).eq("routineId", routineId).eq("weekStart", weekStart))
    .unique();

  const weeklySummary = {
    userId,
    routineId,
    weekStart,
    completed: true,
    hasHistory: Boolean(previousWeekSession),
    deltaPercent: weeklyDelta,
    lastCompletedAt: session.completedAt ?? session.updatedAt,
    latestScore,
    previousScore,
    updatedAt: now,
  };

  if (existingWeeklySummary) {
    await ctx.db.patch(existingWeeklySummary._id, weeklySummary);
  } else {
    await ctx.db.insert("routineWeekSummaries", weeklySummary);
  }

  const completedSessions = await ctx.db
    .query("workoutSessions")
    .withIndex("by_user_routine_status_weekStart", (q) =>
      q.eq("userId", userId).eq("routineId", routineId).eq("status", "completed"),
    )
    .order("desc")
    .take(2);

  const latestCompletedSession = completedSessions[0];
  const previousCompletedSession = completedSessions[1];
  const progressLatestScore = latestCompletedSession ? await loadSessionScore(ctx, latestCompletedSession) : 0;
  const progressPreviousScore = previousCompletedSession ? await loadSessionScore(ctx, previousCompletedSession) : 0;
  const progressDelta =
    previousCompletedSession ? calculateDeltaPercent(progressLatestScore, progressPreviousScore) ?? 0 : 0;

  const existingProgressSummary = await ctx.db
    .query("routineProgressSummaries")
    .withIndex("by_user_routine", (q) => q.eq("userId", userId).eq("routineId", routineId))
    .unique();

  const progressSummary = {
    userId,
    routineId,
    hasHistory: Boolean(previousCompletedSession),
    deltaPercent: progressDelta,
    lastCompletedAt: latestCompletedSession?.completedAt ?? latestCompletedSession?.updatedAt,
    latestCompletedSessionId: latestCompletedSession?._id,
    previousCompletedSessionId: previousCompletedSession?._id,
    updatedAt: now,
  };

  if (existingProgressSummary) {
    await ctx.db.patch(existingProgressSummary._id, progressSummary);
  } else if (latestCompletedSession) {
    await ctx.db.insert("routineProgressSummaries", progressSummary);
  }
}

export async function listWeeklyRoutineSummaries(
  ctx: QueryCtx,
  userId: Id<"users">,
  weekStart: number,
) {
  const routines = await ctx.db
    .query("routines")
    .withIndex("by_user_position", (q) => q.eq("userId", userId))
    .collect();
  const summaries = await ctx.db
    .query("routineWeekSummaries")
    .withIndex("by_user_weekStart", (q) => q.eq("userId", userId).eq("weekStart", weekStart))
    .collect();

  const summaryByRoutineId = new Map(summaries.map((summary) => [summary.routineId, summary]));

  return routines.map((routine) => {
    const summary = summaryByRoutineId.get(routine._id);

    return {
      routineId: routine._id,
      completed: summary?.completed ?? false,
      hasHistory: summary?.hasHistory ?? false,
      deltaPercent: summary?.deltaPercent ?? 0,
      lastCompletedAt: summary?.lastCompletedAt,
    };
  });
}

export async function listProgressSummaries(ctx: QueryCtx, userId: Id<"users">) {
  return await ctx.db
    .query("routineProgressSummaries")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();
}
