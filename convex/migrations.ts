import { mutation } from "./_generated/server";

function getMondayWeekStart(timestamp: number) {
  const date = new Date(timestamp);
  const dayIndex = date.getDay();
  const mondayOffset = (dayIndex + 6) % 7;
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - mondayOffset);
  return date.getTime();
}

export const backfillWeekStart = mutation({
  args: {},
  handler: async (ctx) => {
    // This is a one-time migration to populate the weekStart field.
    // It grabs all workoutSessions that do NOT have a weekStart, and populates it based on completedAt or startedAt.
    const sessions = await ctx.db
      .query("workoutSessions")
      .collect();

    let count = 0;

    for (const session of sessions) {
      if (session.weekStart === undefined) {
        const referenceTime = session.completedAt ?? session.startedAt;
        const weekStart = getMondayWeekStart(referenceTime);

        await ctx.db.patch(session._id, { weekStart });
        count++;
      }
    }

    return `Successfully backfilled weekStart on ${count} workout sessions.`;
  },
});
