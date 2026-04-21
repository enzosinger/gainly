import type { Id } from "./_generated/dataModel";
import type { TechniqueType } from "../src/types/domain";

export type RoutineExerciseSetStructure = {
  id: string;
  technique: TechniqueType;
  backoffPercent?: number;
  clusterBlocks?: number;
  clusterRepRange?: string;
  pairExerciseId?: Id<"exercises">;
  pairWeightKg?: number;
  pairReps?: number;
};

export type RoutineExerciseStructure = {
  id: string;
  exerciseId: Id<"exercises">;
  sets: RoutineExerciseSetStructure[];
  repRangeMin?: number;
  repRangeMax?: number;
  warmupSets?: number;
  feederSets?: number;
};

export type RoutineStructure = {
  exercises: RoutineExerciseStructure[];
};

export type WorkoutSessionSetStructure = {
  id: string;
  templateSetId: string;
  technique: TechniqueType;
  weightKg?: number;
  reps?: number;
  backoffPercent?: number;
  clusterBlocks?: number;
  clusterRepRange?: string;
  pairExerciseId?: Id<"exercises">;
  pairWeightKg?: number;
  pairReps?: number;
};

export type WorkoutSessionExerciseStructure = {
  id: string;
  routineExerciseId: string;
  exerciseId: Id<"exercises">;
  position: number;
  sets: WorkoutSessionSetStructure[];
  repRangeMin?: number;
  repRangeMax?: number;
  warmupSets?: number;
  feederSets?: number;
};

export type WorkoutSessionStructure = {
  exercises: WorkoutSessionExerciseStructure[];
};
