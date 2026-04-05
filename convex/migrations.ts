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
