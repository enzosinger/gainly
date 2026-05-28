import type { Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";

export async function getNextRoutinePosition(ctx: MutationCtx, userId: Id<"users">) {
  const [lastRoutine] = await ctx.db
    .query("routines")
    .withIndex("by_user_position", (q) => q.eq("userId", userId))
    .order("desc")
    .take(1);

  return (lastRoutine?.position ?? -1) + 1;
}
