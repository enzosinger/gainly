import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi } from "vitest";
import RoutinesPage from "./RoutinesPage";
import { GainlyStoreContext } from "../state/gainly-store-context";
import type { GainlyStoreValue } from "../state/gainly-store-types";
import type { Routine } from "../types/domain";

const routines: Routine[] = [
  {
    id: "active-routine",
    name: "Push",
    completed: false,
    deltaPercent: 0,
    isActive: true,
    exercises: [],
  },
  {
    id: "inactive-routine",
    name: "Pull",
    completed: false,
    deltaPercent: 0,
    isActive: false,
    exercises: [],
  },
];

function makeStore(): GainlyStoreValue {
  return {
    viewer: null,
    isLoading: false,
    exercises: [],
    exerciseLibraryExercises: [],
    exerciseLibraryMuscleGroupFilter: "all",
    setExerciseLibraryMuscleGroupFilter: vi.fn(),
    routines,
    expandedExerciseId: null,
    setExpandedExerciseId: vi.fn(),
    createRoutine: vi.fn(),
    duplicateRoutine: vi.fn(),
    renameRoutine: vi.fn(),
    setRoutineActive: vi.fn(),
    deleteRoutine: vi.fn(),
    reorderRoutines: vi.fn(),
    reorderRoutineExercises: vi.fn(),
    addExerciseToRoutine: vi.fn(),
    addSetToRoutineExercise: vi.fn(),
    removeSetFromRoutineExercise: vi.fn(),
    removeExerciseFromRoutine: vi.fn(),
    addTechniqueToRoutineExercise: vi.fn(),
    addSupersetToRoutine: vi.fn(),
    updateRoutineExerciseRepRange: vi.fn(),
    updateRoutineExerciseWarmupSets: vi.fn(),
    updateRoutineExerciseFeederSets: vi.fn(),
    createExercise: vi.fn(),
    updateExercise: vi.fn(),
    deleteExercise: vi.fn(),
    signOut: vi.fn(),
  };
}

describe("RoutinesPage filters", () => {
  it("shows all routines by default and filters between active and inactive lists", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines"]}>
        <GainlyStoreContext.Provider value={makeStore()}>
          <Routes>
            <Route path="/routines" element={<RoutinesPage />} />
          </Routes>
        </GainlyStoreContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /^all routines$/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: /^push$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^pull$/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^active routines$/i }));

    expect(screen.getByRole("button", { name: /^active routines$/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("heading", { name: /^push$/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /^pull$/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^inactive routines$/i }));

    expect(screen.getByRole("button", { name: /^inactive routines$/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("heading", { name: /^push$/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^pull$/i })).toBeInTheDocument();
  });
});
