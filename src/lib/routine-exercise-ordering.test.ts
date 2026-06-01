import { describe, expect, it } from "vitest";
import { mockRoutines } from "../data/mockRoutines";
import { orderRoutineExercisesByIds } from "./routine-exercise-ordering";

describe("routine exercise ordering", () => {
  it("reorders routine exercises without changing exercise contents", () => {
    const routine = mockRoutines[0];
    const ordered = orderRoutineExercisesByIds(routine, routine.exercises.map((exercise) => exercise.id).reverse());

    expect(ordered.exercises.map((exercise) => exercise.id)).toEqual(
      routine.exercises.map((exercise) => exercise.id).reverse(),
    );
    expect(ordered.exercises[0].sets).toBe(routine.exercises[routine.exercises.length - 1].sets);
  });

  it("rejects incomplete, duplicate, or unknown orders", () => {
    const routine = mockRoutines[0];
    const [firstExercise] = routine.exercises;

    expect(() => orderRoutineExercisesByIds(routine, [firstExercise.id])).toThrow(/every exercise/i);
    expect(() => orderRoutineExercisesByIds(routine, [firstExercise.id, firstExercise.id])).toThrow(/duplicates/i);
    expect(() => orderRoutineExercisesByIds(routine, [firstExercise.id, "missing"])).toThrow(/unknown exercise/i);
  });
});
