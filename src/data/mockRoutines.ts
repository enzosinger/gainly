import type { Routine } from "../types/domain";

export const mockRoutines: Routine[] = [
  {
    id: "routine-upper-a",
    name: "Push",
    weekday: "Monday",
    completed: false,
    deltaPercent: 2.1,
    exercises: [
      {
        id: "routine-upper-a-bench",
        exerciseId: "ex-barbell-bench-press",
        sets: [
          { id: "set-upper-a-bench-1", technique: "normal", weightKg: 80, reps: 6 },
          { id: "set-upper-a-bench-2", technique: "backoff", reps: 8, backoffPercent: 10 },
        ],
      },
      {
        id: "routine-upper-a-row",
        exerciseId: "ex-seated-cable-row",
        sets: [{ id: "set-upper-a-row-1", technique: "normal", weightKg: 65, reps: 10 }],
      },
    ],
  },
  {
    id: "routine-lower-a",
    name: "Pull",
    weekday: "Wednesday",
    completed: true,
    deltaPercent: 1.4,
    exercises: [
      {
        id: "routine-lower-a-squat",
        exerciseId: "ex-barbell-back-squat",
        sets: [
          { id: "set-lower-a-squat-1", technique: "normal", weightKg: 110, reps: 5 },
          { id: "set-lower-a-squat-2", technique: "cluster", clusterBlocks: 3, clusterRepRange: "2-3" },
        ],
      },
    ],
  },
  {
    id: "routine-upper-b",
    name: "Legs",
    weekday: "Friday",
    completed: false,
    deltaPercent: 0.8,
    exercises: [
      {
        id: "routine-upper-b-shoulder-press",
        exerciseId: "ex-dumbbell-shoulder-press",
        sets: [{ id: "set-upper-b-press-1", technique: "normal", leftReps: 10, rightReps: 10 }],
      },
      {
        id: "routine-upper-b-arms",
        exerciseId: "ex-incline-dumbbell-curl",
        sets: [
          {
            id: "set-upper-b-arms-1",
            technique: "superset",
            pairExerciseId: "ex-cable-triceps-pushdown",
            pairWeightKg: 22.5,
            pairReps: 12,
          },
        ],
      },
    ],
  },
];
