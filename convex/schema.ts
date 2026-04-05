import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  exerciseDescriptionValidator,
  muscleGroupValidator,
  routineExerciseRowValidator,
  routineExerciseSetRowValidator,
  routineExerciseValidator,
  routineProgressSummaryValidator,
  routineWeekSummaryValidator,
  workoutSessionExerciseRowValidator,
  workoutSessionExerciseValidator,
  workoutSessionSetRowValidator,
  workoutSessionStatusValidator,
} from "./validators";

export default defineSchema({
  ...authTables,
  exercises: defineTable({
    userId: v.id("users"),
    name: v.string(),
    muscleGroup: muscleGroupValidator,
    description: exerciseDescriptionValidator,
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_name", ["userId", "name"])
    .index("by_user_muscleGroup_name", ["userId", "muscleGroup", "name"]),
  routineExercises: defineTable({
    userId: routineExerciseRowValidator.fields.userId,
    routineId: routineExerciseRowValidator.fields.routineId,
    publicId: routineExerciseRowValidator.fields.publicId,
    exerciseId: routineExerciseRowValidator.fields.exerciseId,
    position: routineExerciseRowValidator.fields.position,
    warmupSets: routineExerciseRowValidator.fields.warmupSets,
    feederSets: routineExerciseRowValidator.fields.feederSets,
    createdAt: routineExerciseRowValidator.fields.createdAt,
    updatedAt: routineExerciseRowValidator.fields.updatedAt,
  })
    .index("by_user_routine_position", ["userId", "routineId", "position"])
    .index("by_user_routine_publicId", ["userId", "routineId", "publicId"]),
  routineExerciseSets: defineTable({
    userId: routineExerciseSetRowValidator.fields.userId,
    routineId: routineExerciseSetRowValidator.fields.routineId,
    routineExercisePublicId: routineExerciseSetRowValidator.fields.routineExercisePublicId,
    publicId: routineExerciseSetRowValidator.fields.publicId,
    position: routineExerciseSetRowValidator.fields.position,
    technique: routineExerciseSetRowValidator.fields.technique,
    backoffPercent: routineExerciseSetRowValidator.fields.backoffPercent,
    clusterBlocks: routineExerciseSetRowValidator.fields.clusterBlocks,
    clusterRepRange: routineExerciseSetRowValidator.fields.clusterRepRange,
    pairExerciseId: routineExerciseSetRowValidator.fields.pairExerciseId,
    pairWeightKg: routineExerciseSetRowValidator.fields.pairWeightKg,
    pairReps: routineExerciseSetRowValidator.fields.pairReps,
    createdAt: routineExerciseSetRowValidator.fields.createdAt,
    updatedAt: routineExerciseSetRowValidator.fields.updatedAt,
  })
    .index("by_user_routineExercise_position", ["userId", "routineExercisePublicId", "position"])
    .index("by_user_routineExercise_publicId", ["userId", "routineExercisePublicId", "publicId"])
    .index("by_user_routine_position", ["userId", "routineId", "position"]),
  routines: defineTable({
    userId: v.id("users"),
    name: v.string(),
    completed: v.boolean(),
    deltaPercent: v.number(),
    position: v.number(),
    exercises: v.array(routineExerciseValidator),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_position", ["userId", "position"]),
  workoutSessions: defineTable({
    userId: v.id("users"),
    routineId: v.id("routines"),
    status: workoutSessionStatusValidator,
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
    updatedAt: v.number(),
    weekStart: v.optional(v.number()), // Will be required after migration
    exercises: v.array(workoutSessionExerciseValidator),
  })
    .index("by_user", ["userId"])
    .index("by_user_routine_weekStart", ["userId", "routineId", "weekStart"])
    .index("by_user_routine_status_weekStart", ["userId", "routineId", "status", "weekStart"])
    .index("by_user_status_weekStart_completedAt", ["userId", "status", "weekStart", "completedAt"]),
  workoutSessionExercises: defineTable({
    userId: workoutSessionExerciseRowValidator.fields.userId,
    sessionId: workoutSessionExerciseRowValidator.fields.sessionId,
    routineId: workoutSessionExerciseRowValidator.fields.routineId,
    publicId: workoutSessionExerciseRowValidator.fields.publicId,
    routineExercisePublicId: workoutSessionExerciseRowValidator.fields.routineExercisePublicId,
    exerciseId: workoutSessionExerciseRowValidator.fields.exerciseId,
    position: workoutSessionExerciseRowValidator.fields.position,
    warmupSets: workoutSessionExerciseRowValidator.fields.warmupSets,
    feederSets: workoutSessionExerciseRowValidator.fields.feederSets,
    createdAt: workoutSessionExerciseRowValidator.fields.createdAt,
    updatedAt: workoutSessionExerciseRowValidator.fields.updatedAt,
  })
    .index("by_user_session_position", ["userId", "sessionId", "position"])
    .index("by_user_session_publicId", ["userId", "sessionId", "publicId"])
    .index("by_user_session_routineExercisePublicId", ["userId", "sessionId", "routineExercisePublicId"]),
  workoutSessionSets: defineTable({
    userId: workoutSessionSetRowValidator.fields.userId,
    sessionId: workoutSessionSetRowValidator.fields.sessionId,
    sessionExercisePublicId: workoutSessionSetRowValidator.fields.sessionExercisePublicId,
    routineExercisePublicId: workoutSessionSetRowValidator.fields.routineExercisePublicId,
    publicId: workoutSessionSetRowValidator.fields.publicId,
    templateSetPublicId: workoutSessionSetRowValidator.fields.templateSetPublicId,
    position: workoutSessionSetRowValidator.fields.position,
    technique: workoutSessionSetRowValidator.fields.technique,
    weightKg: workoutSessionSetRowValidator.fields.weightKg,
    reps: workoutSessionSetRowValidator.fields.reps,
    backoffPercent: workoutSessionSetRowValidator.fields.backoffPercent,
    clusterBlocks: workoutSessionSetRowValidator.fields.clusterBlocks,
    clusterRepRange: workoutSessionSetRowValidator.fields.clusterRepRange,
    pairExerciseId: workoutSessionSetRowValidator.fields.pairExerciseId,
    pairWeightKg: workoutSessionSetRowValidator.fields.pairWeightKg,
    pairReps: workoutSessionSetRowValidator.fields.pairReps,
    createdAt: workoutSessionSetRowValidator.fields.createdAt,
    updatedAt: workoutSessionSetRowValidator.fields.updatedAt,
  })
    .index("by_user_sessionExercise_position", ["userId", "sessionExercisePublicId", "position"])
    .index("by_user_sessionExercise_publicId", ["userId", "sessionExercisePublicId", "publicId"])
    .index("by_user_session_publicId", ["userId", "sessionId", "publicId"]),
  routineWeekSummaries: defineTable({
    userId: routineWeekSummaryValidator.fields.userId,
    routineId: routineWeekSummaryValidator.fields.routineId,
    weekStart: routineWeekSummaryValidator.fields.weekStart,
    completed: routineWeekSummaryValidator.fields.completed,
    hasHistory: routineWeekSummaryValidator.fields.hasHistory,
    deltaPercent: routineWeekSummaryValidator.fields.deltaPercent,
    lastCompletedAt: routineWeekSummaryValidator.fields.lastCompletedAt,
    latestScore: routineWeekSummaryValidator.fields.latestScore,
    previousScore: routineWeekSummaryValidator.fields.previousScore,
    updatedAt: routineWeekSummaryValidator.fields.updatedAt,
  })
    .index("by_user_weekStart", ["userId", "weekStart"])
    .index("by_user_routine_weekStart", ["userId", "routineId", "weekStart"]),
  routineProgressSummaries: defineTable({
    userId: routineProgressSummaryValidator.fields.userId,
    routineId: routineProgressSummaryValidator.fields.routineId,
    hasHistory: routineProgressSummaryValidator.fields.hasHistory,
    deltaPercent: routineProgressSummaryValidator.fields.deltaPercent,
    lastCompletedAt: routineProgressSummaryValidator.fields.lastCompletedAt,
    latestCompletedSessionId: routineProgressSummaryValidator.fields.latestCompletedSessionId,
    previousCompletedSessionId: routineProgressSummaryValidator.fields.previousCompletedSessionId,
    updatedAt: routineProgressSummaryValidator.fields.updatedAt,
  })
    .index("by_user", ["userId"])
    .index("by_user_routine", ["userId", "routineId"]),
});
