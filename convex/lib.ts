import { getAuthUserId } from "@convex-dev/auth/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";

export async function requireCurrentUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users">> {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Authentication required.");
  }

  return userId;
}

export async function requireRoutine(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  routineId: Id<"routines">,
): Promise<Doc<"routines">> {
  const routine = await ctx.db.get(routineId);

  if (!routine || routine.userId !== userId) {
    throw new Error("Routine not found.");
  }

  return routine;
}

export async function requireExercise(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  exerciseId: Id<"exercises">,
): Promise<Doc<"exercises">> {
  const exercise = await ctx.db.get(exerciseId);

  if (!exercise || exercise.userId !== userId) {
    throw new Error("Exercise not found.");
  }

  return exercise;
}

export async function requireWorkoutSession(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  sessionId: Id<"workoutSessions">,
): Promise<Doc<"workoutSessions">> {
  const session = await ctx.db.get(sessionId);

  if (!session || session.userId !== userId) {
    throw new Error("Workout session not found.");
  }

  return session;
}
