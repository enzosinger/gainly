import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getFunctionName, type FunctionReference } from "convex/server";
import { currentWeek, makeWeekSession, now, previousWeek, renderWorkoutWeek } from "../test/workout-week-fixture";
import { getWeekWindow } from "../lib/week";

const { ensureSession, saveSet, completeSession, useQuery } = vi.hoisted(() => ({
  ensureSession: vi.fn(),
  saveSet: vi.fn().mockResolvedValue(undefined),
  completeSession: vi.fn().mockResolvedValue(undefined),
  useQuery: vi.fn(),
}));

vi.mock("convex/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("convex/react")>(),
  useQuery,
  useMutation: (mutation: FunctionReference<"mutation">) => {
    switch (getFunctionName(mutation)) {
      case "workouts:ensureSessionForRoutineWeek": return ensureSession;
      case "workouts:updateWorkoutSet": return saveSet;
      case "workouts:completeSession": return completeSession;
      default: throw new Error(`Unexpected mutation: ${getFunctionName(mutation)}`);
    }
  },
}));

const sessions = new Map<number, ReturnType<typeof makeWeekSession>>();
const loadingWeeks = new Set<number>();

beforeEach(() => {
  vi.restoreAllMocks();
  vi.spyOn(Date, "now").mockReturnValue(now);
  sessions.clear();
  loadingWeeks.clear();
  sessions.set(currentWeek, makeWeekSession(currentWeek));
  ensureSession.mockReset().mockResolvedValue(undefined);
  useQuery.mockReset().mockImplementation((query: FunctionReference<"query">, args: { weekStart: number }) => {
    if (getFunctionName(query) === "workouts:previousHistoryForRoutine") {
      return { latestCompletedSession: null };
    }
    return loadingWeeks.has(args.weekStart) ? undefined : sessions.get(args.weekStart) ?? null;
  });
});

describe("workout week navigation", () => {
  it("restores a missing previous week, then restores current week through next and history navigation", async () => {
    const view = renderWorkoutWeek();
    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(80);
    expect(ensureSession).toHaveBeenCalledWith({ routineId: "routine-upper-a", weekStart: currentWeek });

    fireEvent.click(screen.getByRole("button", { name: /previous week/i }));
    expect(screen.getByText(getWeekWindow(previousWeek).label)).toBeInTheDocument();
    expect(screen.queryByRole("spinbutton", { name: /weight/i })).not.toBeInTheDocument();
    await waitFor(() => expect(ensureSession).toHaveBeenCalledWith({ routineId: "routine-upper-a", weekStart: previousWeek }));

    sessions.set(previousWeek, makeWeekSession(previousWeek));
    view.refresh();
    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(75);
    expect(ensureSession).toHaveBeenCalledTimes(2);

    fireEvent.click(screen.getByRole("button", { name: /next week/i }));
    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(80);
    expect(ensureSession).toHaveBeenLastCalledWith({ routineId: "routine-upper-a", weekStart: currentWeek });
    fireEvent.click(screen.getByRole("button", { name: /history back/i }));
    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(75);
    expect(ensureSession).toHaveBeenLastCalledWith({ routineId: "routine-upper-a", weekStart: previousWeek });
    fireEvent.click(screen.getByRole("button", { name: /history forward/i }));
    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(80);
    expect(ensureSession).toHaveBeenLastCalledWith({ routineId: "routine-upper-a", weekStart: currentWeek });
    expect(ensureSession).toHaveBeenCalledTimes(5);
  });

  it("ignores an earlier week's late failure after navigation and does not repeat the current request", async () => {
    let rejectOldRequest: (error: Error) => void = () => {};
    ensureSession.mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectOldRequest = reject; }));
    const view = renderWorkoutWeek();
    fireEvent.click(screen.getByRole("button", { name: /previous week/i }));
    await waitFor(() => expect(ensureSession).toHaveBeenCalledTimes(2));

    await act(async () => { rejectOldRequest(new Error("Old week failed")); });
    expect(screen.queryByText(/unable to restore/i)).not.toBeInTheDocument();
    sessions.set(previousWeek, makeWeekSession(previousWeek));
    view.refresh();
    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(75);
    expect(screen.queryByText(/unable to restore/i)).not.toBeInTheDocument();
    expect(ensureSession).toHaveBeenCalledTimes(2);
  });

  it("retries after returning from a still-loading week when the abandoned request failed", async () => {
    let rejectOldRequest: (error: Error) => void = () => {};
    ensureSession.mockImplementationOnce(() => new Promise((_resolve, reject) => { rejectOldRequest = reject; }));
    renderWorkoutWeek();
    loadingWeeks.add(previousWeek);
    fireEvent.click(screen.getByRole("button", { name: /previous week/i }));
    await act(async () => { rejectOldRequest(new Error("Abandoned request failed")); });
    fireEvent.click(screen.getByRole("button", { name: /next week/i }));
    expect(ensureSession).toHaveBeenCalledTimes(2);
    expect(ensureSession).toHaveBeenLastCalledWith({ routineId: "routine-upper-a", weekStart: currentWeek });
    expect(screen.queryByText(/unable to restore/i)).not.toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(80);
  });

  it("waits for the query, ignores repeated renders, and synchronizes a changed routine version", () => {
    loadingWeeks.add(currentWeek);
    const view = renderWorkoutWeek();
    expect(ensureSession).not.toHaveBeenCalled();
    expect(screen.queryByRole("spinbutton", { name: /weight/i })).not.toBeInTheDocument();
    loadingWeeks.clear();
    view.refresh();
    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(80);
    expect(ensureSession).toHaveBeenCalledTimes(1);
    view.refresh();
    expect(ensureSession).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByRole("button", { name: /update routine version/i }));
    expect(ensureSession).toHaveBeenCalledTimes(2);
    expect(ensureSession).toHaveBeenLastCalledWith({ routineId: "routine-upper-a", weekStart: currentWeek });
  });

  it("shows a current failure and permits a fresh attempt after leaving and returning", async () => {
    ensureSession.mockRejectedValueOnce(new Error("Current week failed"));
    const view = renderWorkoutWeek();
    expect(await screen.findByText(/unable to restore/i)).toBeInTheDocument();

    loadingWeeks.add(previousWeek);
    fireEvent.click(screen.getByRole("button", { name: /previous week/i }));
    expect(screen.queryByText(/unable to restore/i)).not.toBeInTheDocument();
    loadingWeeks.clear();
    view.refresh();
    await waitFor(() => expect(ensureSession).toHaveBeenLastCalledWith({ routineId: "routine-upper-a", weekStart: previousWeek }));
    expect(screen.queryByText(/unable to restore/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /next week/i }));
    expect(ensureSession).toHaveBeenLastCalledWith({ routineId: "routine-upper-a", weekStart: currentWeek });
    expect(screen.queryByText(/unable to restore/i)).not.toBeInTheDocument();
    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(80);
  });
});
