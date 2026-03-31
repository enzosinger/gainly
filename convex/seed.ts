import type { MuscleGroup, TechniqueType } from "../src/types/domain";

type StarterExercise = {
  key: string;
  name: string;
  muscleGroup: MuscleGroup;
};

type StarterSet = {
  id: string;
  technique: TechniqueType;
  weightKg?: number;
  reps?: number;
  backoffPercent?: number;
  clusterBlocks?: number;
  clusterRepRange?: string;
  pairExerciseKey?: string;
  pairWeightKg?: number;
  pairReps?: number;
};

type StarterRoutine = {
  name: string;
  completed: boolean;
  deltaPercent: number;
  exercises: Array<{
    id: string;
    exerciseKey: string;
    sets: StarterSet[];
  }>;
};

export const starterExercises: StarterExercise[] = [
  { key: "barbell-bench-press", name: "Barbell Bench Press", muscleGroup: "chest" },
  { key: "seated-cable-row", name: "Seated Cable Row", muscleGroup: "back" },
  { key: "dumbbell-shoulder-press", name: "Dumbbell Shoulder Press", muscleGroup: "shoulders" },
  { key: "barbell-back-squat", name: "Barbell Back Squat", muscleGroup: "legs" },
  { key: "incline-dumbbell-curl", name: "Incline Dumbbell Curl", muscleGroup: "biceps" },
  { key: "cable-triceps-pushdown", name: "Cable Triceps Pushdown", muscleGroup: "triceps" },
];

export const starterRoutines: StarterRoutine[] = [
  {
    name: "Push",
    completed: false,
    deltaPercent: 2.1,
    exercises: [
      {
        id: "routine-upper-a-bench",
        exerciseKey: "barbell-bench-press",
        sets: [
          { id: "set-upper-a-bench-1", technique: "normal", weightKg: 80, reps: 6 },
          { id: "set-upper-a-bench-2", technique: "backoff", reps: 8, backoffPercent: 10 },
        ],
      },
      {
        id: "routine-upper-a-row",
        exerciseKey: "seated-cable-row",
        sets: [{ id: "set-upper-a-row-1", technique: "normal", weightKg: 65, reps: 10 }],
      },
    ],
  },
  {
    name: "Pull",
    completed: true,
    deltaPercent: 1.4,
    exercises: [
      {
        id: "routine-lower-a-squat",
        exerciseKey: "barbell-back-squat",
        sets: [
          { id: "set-lower-a-squat-1", technique: "normal", weightKg: 110, reps: 5 },
          { id: "set-lower-a-squat-2", technique: "cluster", clusterBlocks: 3, clusterRepRange: "2-3" },
        ],
      },
    ],
  },
  {
    name: "Legs",
    completed: false,
    deltaPercent: 0.8,
    exercises: [
      {
        id: "routine-upper-b-shoulder-press",
        exerciseKey: "dumbbell-shoulder-press",
        sets: [{ id: "set-upper-b-press-1", technique: "normal", reps: 10 }],
      },
      {
        id: "routine-upper-b-arms",
        exerciseKey: "incline-dumbbell-curl",
        sets: [
          {
            id: "set-upper-b-arms-1",
            technique: "superset",
            pairExerciseKey: "cable-triceps-pushdown",
            pairWeightKg: 22.5,
            pairReps: 12,
          },
        ],
      },
    ],
  },
];
