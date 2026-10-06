import { act, cleanup, fireEvent, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSyncExternalStore } from "react";
import { getFunctionName, type FunctionReference } from "convex/server";
import { persistSet, readSession, renderWorkoutSave, resetSession, subscribeSession, type SetPatch } from "../test/workout-save-fixture";

const { saveSet, ensureSession, completeSession } = vi.hoisted(() => ({
  saveSet: vi.fn<(input: SetPatch) => Promise<void>>(),
  ensureSession: vi.fn().mockResolvedValue(undefined),
  completeSession: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("convex/react", async (importOriginal) => ({
  ...await importOriginal<typeof import("convex/react")>(),
  useQuery: (query: FunctionReference<"query">) => {
    const session = useSyncExternalStore(subscribeSession, readSession);
    return getFunctionName(query) === "workouts:sessionForRoutineWeek" ? session : { latestCompletedSession: null };
  },
  useMutation: (mutation: FunctionReference<"mutation">) => {
    switch (getFunctionName(mutation)) {
      case "workouts:updateWorkoutSet": return saveSet;
      case "workouts:ensureSessionForRoutineWeek": return ensureSession;
      case "workouts:completeSession": return completeSession;
      default: throw new Error(`Unexpected mutation: ${getFunctionName(mutation)}`);
    }
  },
}));

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  resetSession();
  saveSet.mockImplementation(async (input: SetPatch) => { persistSet(input); });
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function openSuperset() {
  fireEvent.click(screen.getByRole("button", { name: /open incline dumbbell curl/i }));
}

function openShoulderPress() {
  fireEvent.click(screen.getByRole("button", { name: /open dumbbell shoulder press/i }));
}

describe("workout set persistence", () => {
  it("retries the same entered value after an autosave failure", async () => {
    saveSet.mockRejectedValueOnce(new Error("Temporary save failure"));
    renderWorkoutSave();
    fireEvent.change(screen.getByRole("spinbutton", { name: /weight/i }), { target: { value: "90" } });
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(saveSet).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/unable to save/i)).toBeInTheDocument();

    fireEvent.change(screen.getByRole("spinbutton", { name: /weight/i }), { target: { value: "" } });
    fireEvent.change(screen.getByRole("spinbutton", { name: /weight/i }), { target: { value: "90" } });
    await act(() => vi.advanceTimersByTimeAsync(1000));
    openSuperset();
    openShoulderPress();

    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(90);
    expect(saveSet).toHaveBeenCalledTimes(2);
    expect(saveSet).toHaveBeenLastCalledWith({
      sessionId: "session-upper-b", setId: "shoulder-set",
      weightKg: 90, reps: 10, pairWeightKg: null, pairReps: null,
    });
  });

  it("does not resend an identical save while its first attempt is pending", async () => {
    let finishSave = () => {};
    saveSet.mockImplementationOnce((input) => new Promise<void>((resolve) => {
      finishSave = () => { persistSet(input); resolve(); };
    }));
    renderWorkoutSave();
    fireEvent.change(screen.getByRole("spinbutton", { name: /weight/i }), { target: { value: "90" } });
    await act(() => vi.advanceTimersByTimeAsync(1000));
    fireEvent.blur(screen.getByRole("spinbutton", { name: /weight/i }));
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(saveSet).toHaveBeenCalledTimes(1);
    await act(async () => { finishSave(); });
    openSuperset();
    openShoulderPress();
    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(90);
    expect(saveSet).toHaveBeenCalledTimes(1);
  });

  it("does not resend a successful save while its query update is delayed", async () => {
    saveSet.mockResolvedValueOnce(undefined);
    renderWorkoutSave();
    fireEvent.change(screen.getByRole("spinbutton", { name: /weight/i }), { target: { value: "90" } });
    await act(() => vi.advanceTimersByTimeAsync(1000));
    fireEvent.change(screen.getByRole("spinbutton", { name: /weight/i }), { target: { value: "" } });
    fireEvent.change(screen.getByRole("spinbutton", { name: /weight/i }), { target: { value: "90" } });
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(saveSet).toHaveBeenCalledTimes(1);
    act(() => { persistSet(saveSet.mock.calls[0][0]); });
    openSuperset();
    openShoulderPress();
    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(90);
    expect(saveSet).toHaveBeenCalledTimes(1);
  });

  it("does not let an old rejection invalidate a newer attempt with the same values", async () => {
    let rejectFirst = (_error: Error) => {};
    let finishLatest = () => {};
    saveSet.mockImplementationOnce(() => new Promise<void>((_resolve, reject) => { rejectFirst = reject; }));
    saveSet.mockImplementationOnce(async (input) => { persistSet(input); });
    saveSet.mockImplementationOnce((input) => new Promise<void>((resolve) => {
      finishLatest = () => { persistSet(input); resolve(); };
    }));
    renderWorkoutSave();
    for (const value of ["90", "100", "90"]) {
      fireEvent.change(screen.getByRole("spinbutton", { name: /weight/i }), { target: { value } });
      await act(() => vi.advanceTimersByTimeAsync(1000));
    }
    await act(async () => { rejectFirst(new Error("Earlier save failed")); });
    fireEvent.blur(screen.getByRole("spinbutton", { name: /weight/i }));
    await act(() => vi.advanceTimersByTimeAsync(1000));
    expect(saveSet).toHaveBeenCalledTimes(3);
    await act(async () => { finishLatest(); });
    openSuperset();
    openShoulderPress();
    expect(screen.getByRole("spinbutton", { name: /weight/i })).toHaveValue(90);
  });
});
