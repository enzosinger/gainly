export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "legs"
  | "biceps"
  | "triceps";

export type TechniqueType = "normal" | "backoff" | "cluster" | "superset";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
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

export type RoutineExercise = {
  id: string;
  exerciseId: string;
  sets: SetEntry[];
};

export type Routine = {
  id: string;
  name: string;
  weekday: string;
  completed: boolean;
  deltaPercent: number;
  exercises: RoutineExercise[];
};
