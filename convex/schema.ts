import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  exerciseDescriptionValidator,
  muscleGroupValidator,
  routineExerciseValidator,
  workoutSessionExerciseValidator,
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
});
