import { v } from "convex/values";

export const muscleGroupValidator = v.union(
  v.literal("chest"),
  v.literal("back"),
  v.literal("shoulders"),
  v.literal("legs"),
  v.literal("biceps"),
  v.literal("triceps"),
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

export const workoutSessionExerciseValidator = v.object({
  id: v.string(),
  routineExerciseId: v.string(),
  exerciseId: v.id("exercises"),
  position: v.number(),
  sets: v.array(workoutSessionSetValidator),
});

export const routineExerciseValidator = v.object({
  id: v.string(),
  exerciseId: v.id("exercises"),
  sets: v.array(setEntryValidator),
});
