import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { refreshRoutineSummaryDocs } from "./routineSummary";

type RoutineExercise = Doc<"routines">["exercises"][number];
type RoutineExerciseSet = RoutineExercise["sets"][number];
type WorkoutSessionExercise = Doc<"workoutSessions">["exercises"][number];
type WorkoutSessionSet = WorkoutSessionExercise["sets"][number];

function createSessionEntityId(prefix: string, parts: string[]) {
  return `${prefix}-${parts.join("-")}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

async function listWorkoutSessionExerciseRows(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  sessionId: Id<"workoutSessions">,
) {
  return await ctx.db
    .query("workoutSessionExercises")
    .withIndex("by_user_session_position", (q) => q.eq("userId", userId).eq("sessionId", sessionId))
    .collect();
}

async function listWorkoutSessionSetRows(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">,
  sessionId: Id<"workoutSessions">,
) {
  return await ctx.db
    .query("workoutSessionSets")
    .withIndex("by_user_session_publicId", (q) => q.eq("userId", userId).eq("sessionId", sessionId))
    .collect();
}

function buildWorkoutSessionExercises(
  exerciseRows: Array<Doc<"workoutSessionExercises">>,
  setRows: Array<Doc<"workoutSessionSets">>,
) {
  const setsByExercisePublicId = new Map<string, Array<Doc<"workoutSessionSets">>>();
  for (const setRow of setRows) {
    const sets = setsByExercisePublicId.get(setRow.sessionExercisePublicId) ?? [];
    sets.push(setRow);
    setsByExercisePublicId.set(setRow.sessionExercisePublicId, sets);
  }

  return exerciseRows
    .slice()
    .sort((left, right) => left.position - right.position)
    .map((exerciseRow) => ({
      id: exerciseRow.publicId,
      routineExerciseId: exerciseRow.routineExercisePublicId,
      exerciseId: exerciseRow.exerciseId,
      position: exerciseRow.position,
      warmupSets: exerciseRow.warmupSets,
      feederSets: exerciseRow.feederSets,
      sets: (setsByExercisePublicId.get(exerciseRow.publicId) ?? [])
        .slice()
        .sort((left, right) => left.position - right.position)
        .map((setRow) => ({
          id: setRow.publicId,
          templateSetId: setRow.templateSetPublicId,
          technique: setRow.technique,
          weightKg: setRow.weightKg,
          reps: setRow.reps,
          backoffPercent: setRow.backoffPercent,
          clusterBlocks: setRow.clusterBlocks,
          clusterRepRange: setRow.clusterRepRange,
          pairExerciseId: setRow.pairExerciseId,
          pairWeightKg: setRow.pairWeightKg,
          pairReps: setRow.pairReps,
        })),
    }));
}

async function ensureSessionRowsFromLegacy(ctx: MutationCtx, session: Doc<"workoutSessions">) {
  const exerciseRows = await listWorkoutSessionExerciseRows(ctx, session.userId, session._id);
  if (exerciseRows.length > 0) {
    return exerciseRows;
  }

  const now = Date.now();
  for (const [position, exercise] of session.exercises.entries()) {
    await ctx.db.insert("workoutSessionExercises", {
      userId: session.userId,
      sessionId: session._id,
      routineId: session.routineId,
      publicId: exercise.id,
      routineExercisePublicId: exercise.routineExerciseId,
      exerciseId: exercise.exerciseId,
      position,
      warmupSets: exercise.warmupSets,
      feederSets: exercise.feederSets,
      createdAt: now,
      updatedAt: now,
    });

    for (const [setPosition, set] of exercise.sets.entries()) {
      await ctx.db.insert("workoutSessionSets", {
        userId: session.userId,
        sessionId: session._id,
        sessionExercisePublicId: exercise.id,
        routineExercisePublicId: exercise.routineExerciseId,
        publicId: set.id,
        templateSetPublicId: set.templateSetId,
        position: setPosition,
        technique: set.technique,
        weightKg: set.weightKg,
        reps: set.reps,
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

  return await listWorkoutSessionExerciseRows(ctx, session.userId, session._id);
}

async function persistWorkoutSessionFallback(ctx: MutationCtx, session: Doc<"workoutSessions">) {
  const hydrated = await hydrateWorkoutSession(ctx, session);
  await ctx.db.patch(session._id, {
    exercises: hydrated.exercises,
    updatedAt: Date.now(),
  });
  return hydrated;
}

export async function hydrateWorkoutSession(ctx: QueryCtx | MutationCtx, session: Doc<"workoutSessions">) {
  const exerciseRows = await listWorkoutSessionExerciseRows(ctx, session.userId, session._id);
  if (exerciseRows.length === 0) {
    return session;
  }

  const setRows = await listWorkoutSessionSetRows(ctx, session.userId, session._id);
  return {
    ...session,
    exercises: buildWorkoutSessionExercises(exerciseRows, setRows),
  };
}

export async function seedWorkoutSessionRowsFromLegacy(ctx: MutationCtx, session: Doc<"workoutSessions">) {
  await ensureSessionRowsFromLegacy(ctx, session);
}

export async function upsertWorkoutSessionRowsFromLegacy(ctx: MutationCtx, session: Doc<"workoutSessions">) {
  const exerciseRows = await listWorkoutSessionExerciseRows(ctx, session.userId, session._id);
  const setRows = await listWorkoutSessionSetRows(ctx, session.userId, session._id);
  const exerciseRowByPublicId = new Map(exerciseRows.map((row) => [row.publicId, row]));
  const setRowByPublicId = new Map(setRows.map((row) => [row.publicId, row]));
  const now = Date.now();

  for (const [position, exercise] of session.exercises.entries()) {
    const existingExerciseRow = exerciseRowByPublicId.get(exercise.id);

    if (existingExerciseRow) {
      await ctx.db.patch(existingExerciseRow._id, {
        routineExercisePublicId: exercise.routineExerciseId,
        exerciseId: exercise.exerciseId,
        position,
        warmupSets: exercise.warmupSets,
        feederSets: exercise.feederSets,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("workoutSessionExercises", {
        userId: session.userId,
        sessionId: session._id,
        routineId: session.routineId,
        publicId: exercise.id,
        routineExercisePublicId: exercise.routineExerciseId,
        exerciseId: exercise.exerciseId,
        position,
        warmupSets: exercise.warmupSets,
        feederSets: exercise.feederSets,
        createdAt: now,
        updatedAt: now,
      });
    }

    for (const [setPosition, set] of exercise.sets.entries()) {
      const existingSetRow = setRowByPublicId.get(set.id);

      if (existingSetRow) {
        await ctx.db.patch(existingSetRow._id, {
          sessionExercisePublicId: exercise.id,
          routineExercisePublicId: exercise.routineExerciseId,
          templateSetPublicId: set.templateSetId,
          position: setPosition,
          technique: set.technique,
          weightKg: set.weightKg,
          reps: set.reps,
          backoffPercent: set.backoffPercent,
          clusterBlocks: set.clusterBlocks,
          clusterRepRange: set.clusterRepRange,
          pairExerciseId: set.pairExerciseId,
          pairWeightKg: set.pairWeightKg,
          pairReps: set.pairReps,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("workoutSessionSets", {
          userId: session.userId,
          sessionId: session._id,
          sessionExercisePublicId: exercise.id,
          routineExercisePublicId: exercise.routineExerciseId,
          publicId: set.id,
          templateSetPublicId: set.templateSetId,
          position: setPosition,
          technique: set.technique,
          weightKg: set.weightKg,
          reps: set.reps,
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
}

function buildWorkoutSessionSet(
  routineExerciseId: string,
  set: RoutineExerciseSet,
  index: number,
) {
  return {
    id: createSessionEntityId("session-set", [routineExerciseId, String(index + 1)]),
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

function buildWorkoutSessionExercise(routineExercise: RoutineExercise, index: number) {
  return {
    id: createSessionEntityId("session-exercise", [routineExercise.id, String(index + 1)]),
    routineExerciseId: routineExercise.id,
    exerciseId: routineExercise.exerciseId,
    position: index,
    sets: routineExercise.sets.map((set, setIndex) => buildWorkoutSessionSet(routineExercise.id, set, setIndex)),
    warmupSets: routineExercise.warmupSets,
    feederSets: routineExercise.feederSets,
  };
}

export async function createWorkoutSessionFromRoutine(
  ctx: MutationCtx,
  routine: Doc<"routines">,
  weekStart: number,
  now: number,
) {
  const sessionId = await ctx.db.insert("workoutSessions", {
    userId: routine.userId,
    routineId: routine._id,
    status: "in_progress",
    startedAt: now,
    updatedAt: now,
    weekStart,
    exercises: [],
  });

  for (const [position, routineExercise] of routine.exercises.entries()) {
    const exerciseRow = buildWorkoutSessionExercise(routineExercise, position);
    await ctx.db.insert("workoutSessionExercises", {
      userId: routine.userId,
      sessionId,
      routineId: routine._id,
      publicId: exerciseRow.id,
      routineExercisePublicId: exerciseRow.routineExerciseId,
      exerciseId: exerciseRow.exerciseId,
      position: exerciseRow.position,
      warmupSets: exerciseRow.warmupSets,
      feederSets: exerciseRow.feederSets,
      createdAt: now,
      updatedAt: now,
    });

    for (const [setPosition, set] of exerciseRow.sets.entries()) {
      await ctx.db.insert("workoutSessionSets", {
        userId: routine.userId,
        sessionId,
        sessionExercisePublicId: exerciseRow.id,
        routineExercisePublicId: exerciseRow.routineExerciseId,
        publicId: set.id,
        templateSetPublicId: set.templateSetId,
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

  const session = await ctx.db.get(sessionId);
  if (!session) {
    throw new Error("Workout session could not be created.");
  }

  return await persistWorkoutSessionFallback(ctx, session);
}

export async function syncWorkoutSessionWithRoutine(
  ctx: MutationCtx,
  session: Doc<"workoutSessions">,
  routine: Doc<"routines">,
) {
  const exerciseRows = await ensureSessionRowsFromLegacy(ctx, session);
  const setRows = await listWorkoutSessionSetRows(ctx, session.userId, session._id);
  const exerciseRowsByRoutineExerciseId = new Map(exerciseRows.map((row) => [row.routineExercisePublicId, row]));
  const setRowsByTemplateSetId = new Map(setRows.map((row) => [row.templateSetPublicId, row]));
  const keptExerciseIds = new Set<string>();
  const nextExercises: WorkoutSessionExercise[] = [];
  const now = Date.now();

  for (const [position, routineExercise] of routine.exercises.entries()) {
    const existingExerciseRow = exerciseRowsByRoutineExerciseId.get(routineExercise.id);
    const sessionExercisePublicId =
      existingExerciseRow?.publicId ?? createSessionEntityId("session-exercise", [routineExercise.id, String(position + 1)]);

    keptExerciseIds.add(sessionExercisePublicId);

    if (existingExerciseRow) {
      await ctx.db.patch(existingExerciseRow._id, {
        position,
        exerciseId: routineExercise.exerciseId,
        warmupSets: routineExercise.warmupSets,
        feederSets: routineExercise.feederSets,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("workoutSessionExercises", {
        userId: session.userId,
        sessionId: session._id,
        routineId: routine._id,
        publicId: sessionExercisePublicId,
        routineExercisePublicId: routineExercise.id,
        exerciseId: routineExercise.exerciseId,
        position,
        warmupSets: routineExercise.warmupSets,
        feederSets: routineExercise.feederSets,
        createdAt: now,
        updatedAt: now,
      });
    }

    const nextSets: WorkoutSessionSet[] = [];
    for (const [setPosition, routineSet] of routineExercise.sets.entries()) {
      const existingSetRow = setRowsByTemplateSetId.get(routineSet.id);
      const sessionSetPublicId = existingSetRow?.publicId ?? createSessionEntityId("session-set", [routineExercise.id, String(setPosition + 1)]);
      const nextSet = {
        id: sessionSetPublicId,
        templateSetId: routineSet.id,
        technique: routineSet.technique,
        weightKg: existingSetRow?.weightKg,
        reps: existingSetRow?.reps,
        backoffPercent: routineSet.backoffPercent,
        clusterBlocks: routineSet.clusterBlocks,
        clusterRepRange: routineSet.clusterRepRange,
        pairExerciseId: routineSet.pairExerciseId,
        pairWeightKg: existingSetRow?.pairWeightKg ?? routineSet.pairWeightKg,
        pairReps: existingSetRow?.pairReps ?? routineSet.pairReps,
      };

      nextSets.push(nextSet);

      if (existingSetRow) {
        await ctx.db.patch(existingSetRow._id, {
          position: setPosition,
          technique: routineSet.technique,
          backoffPercent: routineSet.backoffPercent,
          clusterBlocks: routineSet.clusterBlocks,
          clusterRepRange: routineSet.clusterRepRange,
          pairExerciseId: routineSet.pairExerciseId,
          updatedAt: now,
        });
      } else {
        await ctx.db.insert("workoutSessionSets", {
          userId: session.userId,
          sessionId: session._id,
          sessionExercisePublicId,
          routineExercisePublicId: routineExercise.id,
          publicId: sessionSetPublicId,
          templateSetPublicId: routineSet.id,
          position: setPosition,
          technique: routineSet.technique,
          backoffPercent: routineSet.backoffPercent,
          clusterBlocks: routineSet.clusterBlocks,
          clusterRepRange: routineSet.clusterRepRange,
          pairExerciseId: routineSet.pairExerciseId,
          pairWeightKg: routineSet.pairWeightKg,
          pairReps: routineSet.pairReps,
          createdAt: now,
          updatedAt: now,
        });
      }
    }

    const nextTemplateSetIds = new Set(routineExercise.sets.map((set) => set.id));
    const removedSetRows = setRows.filter(
      (setRow) =>
        setRow.sessionExercisePublicId === sessionExercisePublicId &&
        !nextTemplateSetIds.has(setRow.templateSetPublicId),
    );
    await Promise.all(removedSetRows.map((setRow) => ctx.db.delete(setRow._id)));

    nextExercises.push({
      id: sessionExercisePublicId,
      routineExerciseId: routineExercise.id,
      exerciseId: routineExercise.exerciseId,
      position,
      sets: nextSets,
      warmupSets: routineExercise.warmupSets,
      feederSets: routineExercise.feederSets,
    });
  }

  const removedExerciseRows = exerciseRows.filter((row) => !keptExerciseIds.has(row.publicId));
  await Promise.all(
    removedExerciseRows.map(async (exerciseRow) => {
      const removedSetRows = setRows.filter((setRow) => setRow.sessionExercisePublicId === exerciseRow.publicId);
      await Promise.all(removedSetRows.map((setRow) => ctx.db.delete(setRow._id)));
      await ctx.db.delete(exerciseRow._id);
    }),
  );

  await ctx.db.patch(session._id, {
    exercises: nextExercises,
    updatedAt: now,
  });

  const refreshedSession = await ctx.db.get(session._id);
  if (!refreshedSession) {
    throw new Error("Workout session not found.");
  }

  return await hydrateWorkoutSession(ctx, refreshedSession);
}

export async function updateWorkoutSessionSet(
  ctx: MutationCtx,
  session: Doc<"workoutSessions">,
  setId: string,
  patch: {
    weightKg?: number | null;
    reps?: number | null;
    pairWeightKg?: number | null;
    pairReps?: number | null;
  },
) {
  await ensureSessionRowsFromLegacy(ctx, session);
  const targetSet = await ctx.db
    .query("workoutSessionSets")
    .withIndex("by_user_session_publicId", (q) =>
      q.eq("userId", session.userId).eq("sessionId", session._id).eq("publicId", setId),
    )
    .unique();

  if (!targetSet) {
    throw new Error("Workout session set not found.");
  }

  const patchFields: Partial<Pick<Doc<"workoutSessionSets">, "weightKg" | "reps" | "pairWeightKg" | "pairReps">> = {};
  if (patch.weightKg !== undefined) {
    patchFields.weightKg = patch.weightKg ?? undefined;
  }
  if (patch.reps !== undefined) {
    patchFields.reps = patch.reps ?? undefined;
  }
  if (patch.pairWeightKg !== undefined) {
    patchFields.pairWeightKg = patch.pairWeightKg ?? undefined;
  }
  if (patch.pairReps !== undefined) {
    patchFields.pairReps = patch.pairReps ?? undefined;
  }

  await ctx.db.patch(targetSet._id, {
    ...patchFields,
    updatedAt: Date.now(),
  });

  return await persistWorkoutSessionFallback(ctx, session);
}

export async function completeWorkoutSession(
  ctx: MutationCtx,
  session: Doc<"workoutSessions">,
) {
  if (session.status === "completed") {
    return session;
  }

  const now = Date.now();
  await ctx.db.patch(session._id, {
    status: "completed",
    completedAt: now,
    updatedAt: now,
  });

  const completedSession = await ctx.db.get(session._id);
  if (!completedSession) {
    throw new Error("Workout session not found.");
  }

  await refreshRoutineSummaryDocs(ctx, completedSession);
  return await hydrateWorkoutSession(ctx, completedSession);
}
