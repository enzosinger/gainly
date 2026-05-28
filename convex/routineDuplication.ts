import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import { getNextRoutinePosition } from "./routinePositions";
import type { RoutineExerciseSetStructure, RoutineExerciseStructure } from "./structureTypes";

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

function copySetForDuplicate(set: RoutineExerciseSetStructure): RoutineExerciseSetStructure {
  return {
    id: set.id,
    technique: set.technique,
    backoffPercent: set.backoffPercent,
    clusterBlocks: set.clusterBlocks,
    clusterRepRange: set.clusterRepRange,
    pairExerciseId: set.pairExerciseId,
  };
}

function copyExerciseForDuplicate(exercise: RoutineExerciseStructure): RoutineExerciseStructure {
  return {
    id: exercise.id,
    exerciseId: exercise.exerciseId,
    sets: exercise.sets.map(copySetForDuplicate),
    repRangeMin: exercise.repRangeMin,
    repRangeMax: exercise.repRangeMax,
    warmupSets: exercise.warmupSets,
    feederSets: exercise.feederSets,
  };
}

export async function duplicateRoutineWithoutHistory(
  ctx: MutationCtx,
  sourceRoutine: Doc<"routines"> & { exercises: RoutineExerciseStructure[] },
) {
  const position = await getNextRoutinePosition(ctx, sourceRoutine.userId);
  const now = Date.now();

  return {
    name: await buildDuplicateName(ctx, sourceRoutine),
    position,
    createdAt: now,
    updatedAt: now,
    exercises: sourceRoutine.exercises.map(copyExerciseForDuplicate),
  };
}
