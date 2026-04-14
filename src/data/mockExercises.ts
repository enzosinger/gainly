import type { Exercise } from "../types/domain";

export const mockExercises: Exercise[] = [
  {
    id: "ex-barbell-bench-press",
    name: "Barbell Bench Press",
    muscleGroup: "chest",
  },
  {
    id: "ex-seated-cable-row",
    name: "Seated Cable Row",
    muscleGroup: "back",
  },
  {
    id: "ex-dumbbell-shoulder-press",
    name: "Dumbbell Shoulder Press",
    muscleGroup: "shoulders",
  },
  {
    id: "ex-barbell-back-squat",
    name: "Barbell Back Squat",
    muscleGroup: "quads",
  },
  {
    id: "ex-incline-dumbbell-curl",
    name: "Incline Dumbbell Curl",
    muscleGroup: "biceps",
  },
  {
    id: "ex-cable-triceps-pushdown",
    name: "Cable Triceps Pushdown",
    muscleGroup: "triceps",
  },
];
