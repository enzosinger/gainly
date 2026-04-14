import type { MuscleGroup } from "../../lib/muscle-groups";

export type { MuscleGroup };

export type TechniqueType = "normal" | "backoff" | "cluster" | "superset";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  description?: string;
};

export type RoutineCreationInput = {
  name: string;
};

export type SetEntry = {
  id: string;
  technique: TechniqueType;
  weightKg?: number;
  reps?: number;
  backoffPercent?: number;
  clusterBlocks?: number;
  clusterRepRange?: string;
  pairExerciseId?: string;
  pairWeightKg?: number;
  pairReps?: number;
};

export type WorkoutSessionStatus = "in_progress" | "completed";

export type WorkoutSessionSet = {
  id: string;
  templateSetId: string;
  technique: TechniqueType;
  weightKg?: number;
  reps?: number;
  backoffPercent?: number;
  clusterBlocks?: number;
  clusterRepRange?: string;
  pairExerciseId?: string;
  pairWeightKg?: number;
  pairReps?: number;
};

export type WorkoutSessionExercise = {
  id: string;
  routineExerciseId: string;
  exerciseId: string;
  position: number;
  sets: WorkoutSessionSet[];
  warmupSets?: number;
  feederSets?: number;
};

export type WorkoutSession = {
  id: string;
  routineId: string;
  status: WorkoutSessionStatus;
  startedAt: number;
  updatedAt: number;
  completedAt?: number;
  exercises: WorkoutSessionExercise[];
};

export type RoutineExercise = {
  id: string;
  exerciseId: string;
  sets: SetEntry[];
  warmupSets?: number;
  feederSets?: number;
};

export type Routine = {
  id: string;
  name: string;
  completed: boolean;
  deltaPercent: number;
  hasProgressHistory?: boolean;
  exercises: RoutineExercise[];
  updatedAt?: number;
};

export type WeekWindow = {
  start: number;
  endExclusive: number;
  label: string;
};

export type RoutineWeekSummary = {
  routineId: string;
  completed: boolean;
  deltaPercent: number;
  hasHistory: boolean;
  lastCompletedAt?: number;
};

export type RoutineWeekHistory = {
  routineId: string;
  latestCompletedSession: WorkoutSession | null;
  previousCompletedSession: WorkoutSession | null;
  hasHistory: boolean;
};

export type RoutineProgressSummary = {
  routineId: string;
  deltaPercent: number;
  hasHistory: boolean;
  lastCompletedAt?: number;
};
