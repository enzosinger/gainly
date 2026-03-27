import type { Exercise } from "../types/domain";

export const mockExercises: Exercise[] = [
  {
    id: "ex-barbell-bench-press",
    name: "Barbell Bench Press",
    muscleGroup: "chest",
    unilateral: false,
  },
  {
    id: "ex-seated-cable-row",
    name: "Seated Cable Row",
    muscleGroup: "back",
    unilateral: false,
  },
  {
    id: "ex-dumbbell-shoulder-press",
    name: "Dumbbell Shoulder Press",
    muscleGroup: "shoulders",
    unilateral: true,
  },
  {
    id: "ex-barbell-back-squat",
    name: "Barbell Back Squat",
    muscleGroup: "legs",
    unilateral: false,
  },
  {
    id: "ex-incline-dumbbell-curl",
    name: "Incline Dumbbell Curl",
    muscleGroup: "biceps",
    unilateral: true,
  },
  {
    id: "ex-cable-triceps-pushdown",
    name: "Cable Triceps Pushdown",
    muscleGroup: "triceps",
    unilateral: false,
  },
];
