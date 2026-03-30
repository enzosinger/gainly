import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import WorkoutPage from "./WorkoutPage";
import { GainlyStoreProvider } from "../state/gainly-store";
import { getWeekWindow, shiftWeekWindowStart } from "../lib/week";

const mockEnsureActiveSession = vi.fn();
const mockUpdateWorkoutSet = vi.fn();
const mockCompleteSession = vi.fn();
const mockUseQuery = vi.fn();

const now = new Date("2026-03-30T12:00:00").getTime();
const currentWeekWindow = getWeekWindow(now);
const previousWeekWindow = getWeekWindow(shiftWeekWindowStart(currentWeekWindow.start, -1));

const activeSession = {
  _id: "session-routine-upper-a",
  routineId: "routine-upper-a",
  status: "in_progress" as const,
  startedAt: 1711800000000,
  updatedAt: 1711800000000,
  exercises: [
    {
      id: "session-exercise-bench",
      routineExerciseId: "routine-upper-a-bench",
      exerciseId: "ex-barbell-bench-press",
      position: 0,
      sets: [
        {
          id: "session-set-bench-1",
          templateSetId: "set-upper-a-bench-1",
          technique: "normal" as const,
          weightKg: 82.5,
          reps: 6,
        },
        {
          id: "session-set-bench-2",
          templateSetId: "set-upper-a-bench-2",
          technique: "backoff" as const,
          reps: 8,
          backoffPercent: 10,
        },
      ],
    },
    {
      id: "session-exercise-row",
      routineExerciseId: "routine-upper-a-row",
      exerciseId: "ex-seated-cable-row",
      position: 1,
      sets: [
        {
          id: "session-set-row-1",
          templateSetId: "set-upper-a-row-1",
          technique: "normal" as const,
          weightKg: 65,
          reps: 10,
        },
      ],
    },
  ],
};

const currentWeekHistory = {
  routineId: "routine-upper-a",
  latestCompletedSession: {
    _id: "session-routine-upper-a-current-week",
    routineId: "routine-upper-a",
    status: "completed" as const,
    startedAt: 1711713600000,
    updatedAt: 1711713900000,
    completedAt: 1711713900000,
    exercises: [
      {
        id: "current-week-exercise-bench",
        routineExerciseId: "routine-upper-a-bench",
        exerciseId: "ex-barbell-bench-press",
        position: 0,
        sets: [
          {
            id: "current-week-set-bench-1",
            templateSetId: "set-upper-a-bench-1",
            technique: "normal" as const,
            weightKg: 80,
            reps: 6,
          },
        ],
      },
    ],
  },
  previousCompletedSession: null,
  hasHistory: false,
};

const previousWeekHistory = {
  routineId: "routine-upper-a",
  latestCompletedSession: {
    _id: "session-routine-upper-a-previous-week",
    routineId: "routine-upper-a",
    status: "completed" as const,
    startedAt: 1711108800000,
    updatedAt: 1711109100000,
    completedAt: 1711109100000,
    exercises: [
      {
        id: "previous-week-exercise-bench",
        routineExerciseId: "routine-upper-a-bench",
        exerciseId: "ex-barbell-bench-press",
        position: 0,
        sets: [
          {
            id: "previous-week-set-bench-1",
            templateSetId: "set-upper-a-bench-1",
            technique: "normal" as const,
            weightKg: 75,
            reps: 5,
          },
        ],
      },
    ],
  },
  previousCompletedSession: null,
  hasHistory: false,
};

vi.mock("convex/react", async () => {
  const actual = await vi.importActual<typeof import("convex/react")>("convex/react");

  return {
    ...actual,
    useQuery: (...args: unknown[]) => mockUseQuery(...args),
    useMutation: () => {
      mockEnsureActiveSession.mockResolvedValue(activeSession);
      mockUpdateWorkoutSet.mockResolvedValue(undefined);
      mockCompleteSession.mockResolvedValue(undefined);
      return (mutationArgs: { routineId?: string; sessionId?: string; setId?: string }) => {
        if (mutationArgs.setId) {
          return mockUpdateWorkoutSet(mutationArgs);
        }

        if (mutationArgs.sessionId) {
          return mockCompleteSession(mutationArgs);
        }

        if (mutationArgs.routineId) {
          return mockEnsureActiveSession(mutationArgs);
        }

        return undefined;
      };
    },
  };
});

describe("WorkoutPage", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(Date, "now").mockReturnValue(now);
    mockEnsureActiveSession.mockReset();
    mockUpdateWorkoutSet.mockReset();
    mockCompleteSession.mockReset();
    mockUseQuery.mockReset();
    mockUseQuery.mockImplementation((_query, args) => {
      if (args?.weekEndExclusive) {
        if (args.weekStart === previousWeekWindow.start) {
          return previousWeekHistory;
        }

        return currentWeekHistory;
      }

      return activeSession;
    });
  });

  it("shows week-scoped previous session references and saves edited set values", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/workout/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/workout/:routineId" element={<WorkoutPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    expect(screen.getByText(currentWeekWindow.label)).toBeInTheDocument();

    const benchButton = screen.getByRole("button", { name: /barbell bench press/i });
    await user.click(benchButton);

    expect(screen.getByText(/previous 80 kg x 6/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /previous week/i }));

    expect(screen.getByText(previousWeekWindow.label)).toBeInTheDocument();
    expect(screen.getByText(/previous 75 kg x 5/i)).toBeInTheDocument();

    const weightInputs = screen.getAllByRole("spinbutton");
    const firstWeightInput = weightInputs[0];

    fireEvent.change(firstWeightInput, { target: { value: "85" } });
    fireEvent.blur(firstWeightInput);

    await waitFor(() =>
      expect(mockUpdateWorkoutSet).toHaveBeenCalledWith({
        sessionId: "session-routine-upper-a",
        setId: "session-set-bench-1",
        weightKg: 85,
        reps: 6,
        pairWeightKg: null,
        pairReps: null,
      }),
    );

    await user.click(screen.getByRole("button", { name: /complete session/i }));

    expect(mockCompleteSession).toHaveBeenCalledWith({
      sessionId: "session-routine-upper-a",
    });
  });
});
