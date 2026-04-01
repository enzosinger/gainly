import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import DashboardPage from "./DashboardPage";
import { GainlyStoreProvider } from "../state/gainly-store";
import * as gainlyStore from "../state/gainly-store";
import { getWeekWindow, shiftWeekWindowStart } from "../lib/week";

const mockUseQuery = vi.fn();

vi.mock("convex/react", async () => {
  const actual = await vi.importActual<typeof import("convex/react")>("convex/react");

  return {
    ...actual,
    useQuery: (...args: unknown[]) => mockUseQuery(...args),
  };
});

vi.mock("@dnd-kit/core", async () => {
  const actual = await vi.importActual<typeof import("@dnd-kit/core")>("@dnd-kit/core");
  return {
    ...actual,
    DndContext: ({
      children,
      onDragEnd,
    }: {
      children: ReactNode;
      onDragEnd?: (event: { active: { id: string }; over: { id: string } | null }) => void;
    }) => (
      <div>
        {children}
        <button
          type="button"
          onClick={() =>
            onDragEnd?.({
              active: { id: "routine-upper-b" },
              over: { id: "routine-upper-a" },
            })
          }
        >
          Trigger reorder
        </button>
      </div>
    ),
  };
});

describe("DashboardPage", () => {
  const now = new Date("2026-03-30T12:00:00").getTime();
  const currentWeekWindow = getWeekWindow(now);
  const previousWeekStart = shiftWeekWindowStart(currentWeekWindow.start, -1);
  const previousWeekWindow = getWeekWindow(previousWeekStart);

  const currentWeekSummaries = [
    { routineId: "routine-upper-a", completed: true, deltaPercent: 2.1, hasHistory: true, lastCompletedAt: now },
    { routineId: "routine-lower-a", completed: false, deltaPercent: 0, hasHistory: false },
    { routineId: "routine-upper-b", completed: false, deltaPercent: 0, hasHistory: false },
  ];

  const previousWeekSummaries = [
    { routineId: "routine-upper-a", completed: false, deltaPercent: 0, hasHistory: false },
    { routineId: "routine-lower-a", completed: true, deltaPercent: 1.4, hasHistory: true, lastCompletedAt: now - 7 * 24 * 60 * 60 * 1000 },
    { routineId: "routine-upper-b", completed: true, deltaPercent: 0.8, hasHistory: false, lastCompletedAt: now - 7 * 24 * 60 * 60 * 1000 },
  ];

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(Date, "now").mockReturnValue(now);
    mockUseQuery.mockReset();
    mockUseQuery.mockImplementation((_query, args) => {
      if (args?.weekStart === previousWeekWindow.start) {
        return previousWeekSummaries;
      }

      return currentWeekSummaries;
    });
  });

  it("shows all weekly routines with week-scoped states", () => {
    render(
      <MemoryRouter>
        <GainlyStoreProvider>
          <DashboardPage />
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(currentWeekWindow.label)).toBeInTheDocument();
    expect(screen.queryByText(/^mon$/i)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^push$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^pull$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^legs$/i })).toBeInTheDocument();
    expect(screen.getAllByTestId("status-glyph")).toHaveLength(3);
    expect(screen.getAllByTestId("status-glyph-completed")).toHaveLength(1);
    expect(screen.getAllByTestId("status-glyph-upcoming")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /^log push workout$/i })).toHaveAttribute(
      "href",
      "/workout/routine-upper-a",
    );
  });

  it("reorders routines and moves between weeks with the same strip", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <GainlyStoreProvider>
          <DashboardPage />
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    expect(screen.getAllByRole("heading", { level: 3 }).map((item) => item.textContent)).toEqual([
      "Push",
      "Pull",
      "Legs",
    ]);

    await user.click(screen.getByRole("button", { name: /trigger reorder/i }));

    expect(screen.getAllByRole("heading", { level: 3 }).map((item) => item.textContent)).toEqual([
      "Legs",
      "Push",
      "Pull",
    ]);

    await user.click(screen.getByRole("button", { name: /previous week/i }));

    expect(screen.getByText(previousWeekWindow.label)).toBeInTheDocument();
    expect(screen.getAllByTestId("status-glyph-completed")).toHaveLength(2);
  });

  it("shows a fallback when there are no routines linked to the user", () => {
    vi.spyOn(gainlyStore, "useGainlyStore").mockReturnValue({
      viewer: null,
      exercises: [],
      exerciseLibraryExercises: [],
      exerciseLibraryMuscleGroupFilter: "all",
      setExerciseLibraryMuscleGroupFilter: vi.fn(),
      routines: [],
      expandedExerciseId: null,
      setExpandedExerciseId: vi.fn(),
      createRoutine: vi.fn(),
      deleteRoutine: vi.fn(),
      reorderRoutines: vi.fn(),
      addExerciseToRoutine: vi.fn(),
      addSetToRoutineExercise: vi.fn(),
      removeSetFromRoutineExercise: vi.fn(),
      removeExerciseFromRoutine: vi.fn(),

      addTechniqueToRoutineExercise: vi.fn(),
      updateRoutineExerciseWarmupSets: vi.fn(),
      updateRoutineExerciseFeederSets: vi.fn(),
      createExercise: vi.fn(),
      updateExercise: vi.fn(),
      deleteExercise: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /no routines yet/i })).toBeInTheDocument();
    expect(screen.getByText(/create your first routine to start tracking weekly completion/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /go to routines/i })).toHaveAttribute("href", "/routines");
  });
});
