import { paginationOptsValidator } from "convex/server";
import type { Doc } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";
import { refreshRoutineSummaryDocs } from "./routineSummary";

function getMondayWeekStart(timestamp: number) {
  const date = new Date(timestamp);
  const dayIndex = date.getDay();
  const mondayOffset = (dayIndex + 6) % 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - mondayOffset);
  return date.getTime();
}

function stripLegacyExercises<T extends { _id: unknown; _creationTime: unknown; exercises?: unknown }>(doc: T) {
  const { _id, _creationTime, exercises: _legacyExercises, ...rest } = doc;
  return rest;
}

export const backfillWeekStart = internalMutation({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db.query("workoutSessions").collect();

    let count = 0;

    for (const session of sessions) {
      if (session.weekStart === undefined) {
        const referenceTime = session.completedAt ?? session.startedAt;
        const weekStart = getMondayWeekStart(referenceTime);

        await ctx.db.patch(session._id, { weekStart });
        count++;
      }
    }

    return { updated: count };
  },
});

export const cleanupLegacyRoutineEmbeds = internalMutation({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const page = await ctx.db.query("routines").paginate(args.paginationOpts);
    let cleaned = 0;

    for (const routine of page.page) {
      if (!("exercises" in routine)) {
        continue;
      }

      await ctx.db.replace(routine._id, stripLegacyExercises(routine as Doc<"routines"> & { exercises: unknown }));
      cleaned++;
    }

    return {
      processed: page.page.length,
      cleaned,
      isDone: page.isDone,
      continueCursor: page.continueCursor,
    };
  },
});

export const cleanupLegacyWorkoutSessionEmbeds = internalMutation({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const page = await ctx.db.query("workoutSessions").paginate(args.paginationOpts);
    let cleaned = 0;

    for (const session of page.page) {
      if (!("exercises" in session)) {
        continue;
      }

      await ctx.db.replace(session._id, stripLegacyExercises(session as Doc<"workoutSessions"> & { exercises: unknown }));
      cleaned++;
    }

    return {
      processed: page.page.length,
      cleaned,
      isDone: page.isDone,
      continueCursor: page.continueCursor,
    };
  },
});

export const backfillRoutineSummaries = internalMutation({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const page = await ctx.db.query("workoutSessions").paginate(args.paginationOpts);
    let processed = 0;
    let refreshed = 0;

    for (const session of page.page) {
      if (session.status !== "completed") {
        processed++;
        continue;
      }

      let sessionForSummary: Doc<"workoutSessions"> = session;
      if (session.weekStart === undefined) {
        const referenceTime = session.completedAt ?? session.startedAt;
        const weekStart = getMondayWeekStart(referenceTime);
        await ctx.db.patch(session._id, { weekStart });
        sessionForSummary = {
          ...session,
          weekStart,
        };
      }

      await refreshRoutineSummaryDocs(ctx, sessionForSummary);
      processed++;
      refreshed++;
    }

    return {
      processed,
      refreshed,
      isDone: page.isDone,
      continueCursor: page.continueCursor,
    };
  },
});
