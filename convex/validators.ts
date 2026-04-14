import { v } from "convex/values";
import { ALL_MUSCLE_GROUPS } from "../lib/muscle-groups";

export const muscleGroupValidator = v.union(
  ...(
    ALL_MUSCLE_GROUPS.map((muscleGroup) => v.literal(muscleGroup)) as [
      ReturnType<typeof v.literal>,
      ReturnType<typeof v.literal>,
      ...ReturnType<typeof v.literal>[],
    ]
  ),
);

export const exerciseDescriptionValidator = v.optional(v.string());

export const techniqueTypeValidator = v.union(
  v.literal("normal"),
  v.literal("backoff"),
  v.literal("cluster"),
  v.literal("superset"),
);

export const setEntryValidator = v.object({
  id: v.string(),
  technique: techniqueTypeValidator,
  weightKg: v.optional(v.number()),
  reps: v.optional(v.number()),
  backoffPercent: v.optional(v.number()),
  clusterBlocks: v.optional(v.number()),
  clusterRepRange: v.optional(v.string()),
  pairExerciseId: v.optional(v.id("exercises")),
  pairWeightKg: v.optional(v.number()),
  pairReps: v.optional(v.number()),
});

export const workoutSessionStatusValidator = v.union(v.literal("in_progress"), v.literal("completed"));

export const workoutSessionSetValidator = v.object({
  id: v.string(),
  templateSetId: v.string(),
  technique: techniqueTypeValidator,
  weightKg: v.optional(v.number()),
  reps: v.optional(v.number()),
  backoffPercent: v.optional(v.number()),
  clusterBlocks: v.optional(v.number()),
  clusterRepRange: v.optional(v.string()),
  pairExerciseId: v.optional(v.id("exercises")),
  pairWeightKg: v.optional(v.number()),
  pairReps: v.optional(v.number()),
});

export const routineExerciseRowValidator = v.object({
  userId: v.id("users"),
  routineId: v.id("routines"),
  publicId: v.string(),
  exerciseId: v.id("exercises"),
  position: v.number(),
  warmupSets: v.optional(v.number()),
  feederSets: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const routineExerciseSetRowValidator = v.object({
  userId: v.id("users"),
  routineId: v.id("routines"),
  routineExercisePublicId: v.string(),
  publicId: v.string(),
  position: v.number(),
  technique: techniqueTypeValidator,
  backoffPercent: v.optional(v.number()),
  clusterBlocks: v.optional(v.number()),
  clusterRepRange: v.optional(v.string()),
  pairExerciseId: v.optional(v.id("exercises")),
  pairWeightKg: v.optional(v.number()),
  pairReps: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const workoutSessionExerciseRowValidator = v.object({
  userId: v.id("users"),
  sessionId: v.id("workoutSessions"),
  routineId: v.id("routines"),
  publicId: v.string(),
  routineExercisePublicId: v.string(),
  exerciseId: v.id("exercises"),
  position: v.number(),
  warmupSets: v.optional(v.number()),
  feederSets: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const workoutSessionSetRowValidator = v.object({
  userId: v.id("users"),
  sessionId: v.id("workoutSessions"),
  sessionExercisePublicId: v.string(),
  routineExercisePublicId: v.string(),
  publicId: v.string(),
  templateSetPublicId: v.string(),
  position: v.number(),
  technique: techniqueTypeValidator,
  weightKg: v.optional(v.number()),
  reps: v.optional(v.number()),
  backoffPercent: v.optional(v.number()),
  clusterBlocks: v.optional(v.number()),
  clusterRepRange: v.optional(v.string()),
  pairExerciseId: v.optional(v.id("exercises")),
  pairWeightKg: v.optional(v.number()),
  pairReps: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const routineWeekSummaryValidator = v.object({
  userId: v.id("users"),
  routineId: v.id("routines"),
  weekStart: v.number(),
  completed: v.boolean(),
  hasHistory: v.boolean(),
  deltaPercent: v.number(),
  lastCompletedAt: v.optional(v.number()),
  latestScore: v.number(),
  previousScore: v.number(),
  updatedAt: v.number(),
});

export const routineProgressSummaryValidator = v.object({
  userId: v.id("users"),
  routineId: v.id("routines"),
  hasHistory: v.boolean(),
  deltaPercent: v.number(),
  lastCompletedAt: v.optional(v.number()),
  latestCompletedSessionId: v.optional(v.id("workoutSessions")),
  previousCompletedSessionId: v.optional(v.id("workoutSessions")),
  updatedAt: v.number(),
});
