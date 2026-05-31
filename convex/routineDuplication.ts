import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { copyExercisesForDuplicateWithBaseline } from "./routineDuplicationBaselines";
import { getNextRoutinePosition } from "./routinePositions";
import type { RoutineExerciseStructure } from "./structureTypes";
import { hydrateWorkoutSession } from "./workoutSessionStructure";

const COPY_NAME_ATTEMPT_LIMIT = 100;

async function routineNameExists(ctx: MutationCtx, userId: Id<"users">, name: string) {
  const [routine] = await ctx.db
    .query("routines")
    .withIndex("by_user_name", (q) => q.eq("userId", userId).eq("name", name))
    .take(1);

  return routine !== undefined;
}

async function buildDuplicateName(ctx: MutationCtx, sourceRoutine: Doc<"routines">) {
  const baseName = `${sourceRoutine.name} copy`;
  const userId = sourceRoutine.userId;

  for (let attempt = 1; attempt <= COPY_NAME_ATTEMPT_LIMIT; attempt += 1) {
    const nextName = attempt === 1 ? baseName : `${baseName} ${attempt}`;
    if (!(await routineNameExists(ctx, userId, nextName))) {
      return nextName;
    }
  }

  const fallbackName = `${baseName} ${Date.now()}`;
  if (!(await routineNameExists(ctx, userId, fallbackName))) {
    return fallbackName;
  }

  return `${fallbackName} ${sourceRoutine._id}`;
}

async function latestCompletedSessionForDuplicate(ctx: MutationCtx, sourceRoutine: Doc<"routines">) {
  const session = await ctx.db
    .query("workoutSessions")
    .withIndex("by_user_routine_status_weekStart", (q) =>
      q.eq("userId", sourceRoutine.userId).eq("routineId", sourceRoutine._id).eq("status", "completed"),
    )
    .order("desc")
    .first();

  return session ? await hydrateWorkoutSession(ctx, session) : null;
}

export async function duplicateRoutineWithoutHistory(
  ctx: MutationCtx,
  sourceRoutine: Doc<"routines"> & { exercises: RoutineExerciseStructure[] },
) {
  const position = await getNextRoutinePosition(ctx, sourceRoutine.userId);
  const latestSession = await latestCompletedSessionForDuplicate(ctx, sourceRoutine);
  const now = Date.now();

  return {
    name: await buildDuplicateName(ctx, sourceRoutine),
    position,
    createdAt: now,
    updatedAt: now,
    exercises: copyExercisesForDuplicateWithBaseline(sourceRoutine.exercises, latestSession?.exercises),
  };
}
