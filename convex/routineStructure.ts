import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import type {
  RoutineExerciseSetStructure,
  RoutineExerciseStructure,
  RoutineStructure,
} from "./structureTypes";

async function listRoutineExerciseRows(ctx: QueryCtx | MutationCtx, userId: Id<"users">, routineId: Id<"routines">) {
  return await ctx.db
    .query("routineExercises")
    .withIndex("by_user_routine_position", (q) => q.eq("userId", userId).eq("routineId", routineId))
    .collect();
}

async function listRoutineExerciseSetRows(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  routineId: Id<"routines">,
) {
  return await ctx.db
    .query("routineExerciseSets")
    .withIndex("by_user_routine_position", (q) => q.eq("userId", userId).eq("routineId", routineId))
    .collect();
}

function buildRoutineExercises(
  exerciseRows: Array<Doc<"routineExercises">>,
  setRows: Array<Doc<"routineExerciseSets">>,
): RoutineStructure["exercises"] {
  const setsByExercisePublicId = new Map<string, Array<Doc<"routineExerciseSets">>>();

  for (const setRow of setRows) {
    const sets = setsByExercisePublicId.get(setRow.routineExercisePublicId) ?? [];
    sets.push(setRow);
    setsByExercisePublicId.set(setRow.routineExercisePublicId, sets);
  }

  return exerciseRows
    .slice()
    .sort((left, right) => left.position - right.position)
    .map((exerciseRow): RoutineExerciseStructure => ({
      id: exerciseRow.publicId,
      exerciseId: exerciseRow.exerciseId,
      warmupSets: exerciseRow.warmupSets,
      feederSets: exerciseRow.feederSets,
      sets: (setsByExercisePublicId.get(exerciseRow.publicId) ?? [])
        .slice()
        .sort((left, right) => left.position - right.position)
        .map(
          (setRow): RoutineExerciseSetStructure => ({
            id: setRow.publicId,
            technique: setRow.technique,
            backoffPercent: setRow.backoffPercent,
            clusterBlocks: setRow.clusterBlocks,
            clusterRepRange: setRow.clusterRepRange,
            pairExerciseId: setRow.pairExerciseId,
            pairWeightKg: setRow.pairWeightKg,
            pairReps: setRow.pairReps,
          }),
        ),
    }));
}

async function listRoutineStructure(ctx: QueryCtx | MutationCtx, routine: Doc<"routines">) {
  const exerciseRows = await listRoutineExerciseRows(ctx, routine.userId, routine._id);
  const setRows = await listRoutineExerciseSetRows(ctx, routine.userId, routine._id);
  return buildRoutineExercises(exerciseRows, setRows);
}

export async function hydrateRoutine(
  ctx: QueryCtx | MutationCtx,
  routine: Doc<"routines">,
): Promise<Doc<"routines"> & RoutineStructure> {
  return {
    ...routine,
    exercises: await listRoutineStructure(ctx, routine),
  };
}

export async function writeRoutineStructure(
  ctx: MutationCtx,
  routine: Pick<Doc<"routines">, "_id" | "userId">,
  exercises: RoutineStructure["exercises"],
) {
  const now = Date.now();

  for (const [position, exercise] of exercises.entries()) {
    await ctx.db.insert("routineExercises", {
      userId: routine.userId,
      routineId: routine._id,
      publicId: exercise.id,
      exerciseId: exercise.exerciseId,
      position,
      warmupSets: exercise.warmupSets,
      feederSets: exercise.feederSets,
      createdAt: now,
      updatedAt: now,
    });

    for (const [setPosition, set] of exercise.sets.entries()) {
      await ctx.db.insert("routineExerciseSets", {
        userId: routine.userId,
        routineId: routine._id,
        routineExercisePublicId: exercise.id,
        publicId: set.id,
        position: setPosition,
        technique: set.technique,
        backoffPercent: set.backoffPercent,
        clusterBlocks: set.clusterBlocks,
        clusterRepRange: set.clusterRepRange,
        pairExerciseId: set.pairExerciseId,
        pairWeightKg: set.pairWeightKg,
        pairReps: set.pairReps,
        createdAt: now,
        updatedAt: now,
      });
    }
  }
}

function buildRoutineExercisePublicId(
  exerciseId: Id<"exercises">,
  nextIndex: number,
  pairExerciseId?: Id<"exercises">,
) {
  return pairExerciseId
    ? `routine-item-${String(exerciseId)}-${String(pairExerciseId)}-${nextIndex}`
    : `routine-item-${String(exerciseId)}-${nextIndex}`;
}

function buildRoutineSetPublicId(routineExerciseId: string, nextIndex: number) {
  return `${routineExerciseId}-set-${nextIndex}`;
}

async function refreshRoutine(ctx: MutationCtx, routine: Doc<"routines">) {
  return await hydrateRoutine(ctx, routine);
}

export async function addRoutineExercise(
  ctx: MutationCtx,
  routine: Doc<"routines">,
  exerciseId: Id<"exercises">,
) {
  const exerciseRows = await listRoutineExerciseRows(ctx, routine.userId, routine._id);
  const nextIndex = exerciseRows.reduce((maxPosition, exerciseRow) => Math.max(maxPosition, exerciseRow.position), -1) + 1;
  const now = Date.now();
  const routineExerciseId = buildRoutineExercisePublicId(exerciseId, nextIndex + 1);

  await ctx.db.insert("routineExercises", {
    userId: routine.userId,
    routineId: routine._id,
    publicId: routineExerciseId,
    exerciseId,
    position: nextIndex,
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.insert("routineExerciseSets", {
    userId: routine.userId,
    routineId: routine._id,
    routineExercisePublicId: routineExerciseId,
    publicId: buildRoutineSetPublicId(routineExerciseId, 1),
    position: 0,
    technique: "normal",
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.patch(routine._id, {
    updatedAt: now,
  });

  return await refreshRoutine(ctx, { ...routine, updatedAt: now });
}

export async function addRoutineSuperset(
  ctx: MutationCtx,
  routine: Doc<"routines">,
  exerciseId: Id<"exercises">,
  pairExerciseId: Id<"exercises">,
) {
  const exerciseRows = await listRoutineExerciseRows(ctx, routine.userId, routine._id);
  const nextIndex = exerciseRows.reduce((maxPosition, exerciseRow) => Math.max(maxPosition, exerciseRow.position), -1) + 1;
  const now = Date.now();
  const routineExerciseId = buildRoutineExercisePublicId(exerciseId, nextIndex + 1, pairExerciseId);

  await ctx.db.insert("routineExercises", {
    userId: routine.userId,
    routineId: routine._id,
    publicId: routineExerciseId,
    exerciseId,
    position: nextIndex,
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.insert("routineExerciseSets", {
    userId: routine.userId,
    routineId: routine._id,
    routineExercisePublicId: routineExerciseId,
    publicId: buildRoutineSetPublicId(routineExerciseId, 1),
    position: 0,
    technique: "superset",
    pairExerciseId,
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.patch(routine._id, {
    updatedAt: now,
  });

  return await refreshRoutine(ctx, { ...routine, updatedAt: now });
}

export async function addRoutineSet(
  ctx: MutationCtx,
  routine: Doc<"routines">,
  routineExerciseId: string,
  technique?: "normal" | "backoff" | "cluster" | "superset",
) {
  const exerciseRows = await listRoutineExerciseRows(ctx, routine.userId, routine._id);
  const setRows = await listRoutineExerciseSetRows(ctx, routine.userId, routine._id);
  const targetExercise = exerciseRows.find((exerciseRow) => exerciseRow.publicId === routineExerciseId);
  if (!targetExercise) {
    throw new Error("Routine exercise not found.");
  }

  const currentSets = setRows
    .filter((setRow) => setRow.routineExercisePublicId === routineExerciseId)
    .slice()
    .sort((left, right) => left.position - right.position);
  const nextIndex = currentSets.length + 1;
  const supersetSet = currentSets.find((set) => set.technique === "superset" && set.pairExerciseId);
  const nextTechnique = technique ?? (supersetSet ? "superset" : "normal");
  const now = Date.now();

  await ctx.db.insert("routineExerciseSets", {
    userId: routine.userId,
    routineId: routine._id,
    routineExercisePublicId: routineExerciseId,
    publicId: buildRoutineSetPublicId(routineExerciseId, nextIndex),
    position: nextIndex - 1,
    technique: nextTechnique,
    pairExerciseId: nextTechnique === "superset" ? supersetSet?.pairExerciseId : undefined,
    createdAt: now,
    updatedAt: now,
  });

  await ctx.db.patch(routine._id, {
    updatedAt: now,
  });

  return await refreshRoutine(ctx, { ...routine, updatedAt: now });
}

export async function removeRoutineExercise(
  ctx: MutationCtx,
  routine: Doc<"routines">,
  routineExerciseId: string,
) {
  const now = Date.now();
  const exerciseRows = await listRoutineExerciseRows(ctx, routine.userId, routine._id);
  const targetExercise = exerciseRows.find((exerciseRow) => exerciseRow.publicId === routineExerciseId);
  if (!targetExercise) {
    return false;
  }

  const setRows = await listRoutineExerciseSetRows(ctx, routine.userId, routine._id);
  await Promise.all(
    setRows
      .filter((setRow) => setRow.routineExercisePublicId === routineExerciseId)
      .map((setRow) => ctx.db.delete(setRow._id)),
  );
  await ctx.db.delete(targetExercise._id);

  const remainingExercises = exerciseRows
    .filter((exerciseRow) => exerciseRow.publicId !== routineExerciseId)
    .map((exerciseRow, position) => ({
      ...exerciseRow,
      position,
    }));

  await Promise.all(
    remainingExercises.map((exerciseRow) =>
      ctx.db.patch(exerciseRow._id, {
        position: exerciseRow.position,
        updatedAt: now,
      }),
    ),
  );

  await ctx.db.patch(routine._id, {
    updatedAt: now,
  });

  return await refreshRoutine(ctx, { ...routine, updatedAt: now });
}

export async function removeRoutineSet(
  ctx: MutationCtx,
  routine: Doc<"routines">,
  routineExerciseId: string,
  setId: string,
) {
  const now = Date.now();
  const targetExercise = await ctx.db
    .query("routineExercises")
    .withIndex("by_user_routine_publicId", (q) =>
      q.eq("userId", routine.userId).eq("routineId", routine._id).eq("publicId", routineExerciseId),
    )
    .unique();

  if (!targetExercise) {
    throw new Error("Routine exercise not found.");
  }

  const targetSet = await ctx.db
    .query("routineExerciseSets")
    .withIndex("by_user_routineExercise_publicId", (q) =>
      q.eq("userId", routine.userId).eq("routineExercisePublicId", routineExerciseId).eq("publicId", setId),
    )
    .unique();

  if (!targetSet) {
    throw new Error("Routine set not found.");
  }

  await ctx.db.delete(targetSet._id);
  const remainingSets = await ctx.db
    .query("routineExerciseSets")
    .withIndex("by_user_routineExercise_position", (q) =>
      q.eq("userId", routine.userId).eq("routineExercisePublicId", routineExerciseId),
    )
    .collect();

  await Promise.all(
    remainingSets.map((setRow, position) =>
      ctx.db.patch(setRow._id, {
        position,
        updatedAt: now,
      }),
    ),
  );

  await ctx.db.patch(routine._id, {
    updatedAt: now,
  });

  return await refreshRoutine(ctx, { ...routine, updatedAt: now });
}

export async function updateRoutineWarmupSets(
  ctx: MutationCtx,
  routine: Doc<"routines">,
  routineExerciseId: string,
  warmupSets: number,
) {
  const now = Date.now();
  const targetExercise = await ctx.db
    .query("routineExercises")
    .withIndex("by_user_routine_publicId", (q) =>
      q.eq("userId", routine.userId).eq("routineId", routine._id).eq("publicId", routineExerciseId),
    )
    .unique();

  if (!targetExercise) {
    throw new Error("Routine exercise not found.");
  }

  await ctx.db.patch(targetExercise._id, {
    warmupSets,
    updatedAt: now,
  });

  await ctx.db.patch(routine._id, {
    updatedAt: now,
  });

  return await refreshRoutine(ctx, { ...routine, updatedAt: now });
}

export async function updateRoutineFeederSets(
  ctx: MutationCtx,
  routine: Doc<"routines">,
  routineExerciseId: string,
  feederSets: number,
) {
  const now = Date.now();
  const targetExercise = await ctx.db
    .query("routineExercises")
    .withIndex("by_user_routine_publicId", (q) =>
      q.eq("userId", routine.userId).eq("routineId", routine._id).eq("publicId", routineExerciseId),
    )
    .unique();

  if (!targetExercise) {
    throw new Error("Routine exercise not found.");
  }

  await ctx.db.patch(targetExercise._id, {
    feederSets,
    updatedAt: now,
  });

  await ctx.db.patch(routine._id, {
    updatedAt: now,
  });

  return await refreshRoutine(ctx, { ...routine, updatedAt: now });
}

export async function addRoutineTechnique(
  ctx: MutationCtx,
  routine: Doc<"routines">,
  routineExerciseId: string,
  technique: "backoff" | "cluster" | "superset",
) {
  return await addRoutineSet(ctx, routine, routineExerciseId, technique);
}
