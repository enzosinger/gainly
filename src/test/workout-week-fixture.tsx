import { StrictMode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useNavigate } from "react-router-dom";
import WorkoutPage from "../pages/WorkoutPage";
import { GainlyStoreProvider, useGainlyStore } from "../state/gainly-store";
import { getMondayWeekStart, shiftWeekWindowStart } from "../lib/week";

export const now = new Date("2026-03-30T12:00:00").getTime();
export const currentWeek = getMondayWeekStart(now);
export const previousWeek = shiftWeekWindowStart(currentWeek, -1);

export function makeWeekSession(weekStart: number) {
  return {
    _id: `session-${weekStart}`,
    routineId: "routine-upper-a",
    status: "in_progress" as const,
    weekStart,
    exercises: [{
      id: `exercise-${weekStart}`,
      routineExerciseId: "routine-upper-a-bench",
      exerciseId: "ex-barbell-bench-press",
      position: 0,
      sets: [{
        id: `set-${weekStart}`,
        templateSetId: "set-upper-a-bench-1",
        technique: "normal" as const,
        weightKg: weekStart === currentWeek ? 80 : 75,
        reps: 6,
      }],
    }],
  };
}

function HistoryControls() {
  const navigate = useNavigate();
  const { setRoutineActive } = useGainlyStore();
  return <>
    <button onClick={() => void navigate(-1)}>History back</button>
    <button onClick={() => void navigate(1)}>History forward</button>
    <button onClick={() => void setRoutineActive("routine-upper-a", true)}>Update routine version</button>
  </>;
}

export function renderWorkoutWeek() {
  const app = () => <StrictMode><MemoryRouter initialEntries={["/workout/routine-upper-a"]}>
    <GainlyStoreProvider>
      <HistoryControls />
      <Routes><Route path="/workout/:routineId" element={<WorkoutPage />} /></Routes>
    </GainlyStoreProvider>
  </MemoryRouter></StrictMode>;
  const view = render(app());
  return { ...view, refresh: () => view.rerender(app()) };
}
