import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RoutinesPage from "./RoutinesPage";
import RoutineDetailPage from "./RoutineDetailPage";
import { GainlyStoreProvider } from "../state/gainly-store";
import * as gainlyStore from "../state/gainly-store";

describe("RoutinesPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a loading state while routines are hydrating", () => {
    vi.spyOn(gainlyStore, "useGainlyStore").mockReturnValue({
      viewer: null,
      isLoading: true,
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
      addSupersetToRoutine: vi.fn(),
      updateRoutineExerciseWarmupSets: vi.fn(),
      updateRoutineExerciseFeederSets: vi.fn(),
      createExercise: vi.fn(),
      updateExercise: vi.fn(),
      deleteExercise: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/routines"]}>
        <RoutinesPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("status", { name: /connecting to your training workspace/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /create new/i })).not.toBeInTheDocument();
  });

  it("opens and closes the create routine form accessibly", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines" element={<RoutinesPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    const createButton = screen.getByRole("button", { name: /create new/i });

    expect(createButton).toHaveAttribute("aria-expanded", "false");
    expect(createButton).toHaveAttribute("aria-controls");

    await user.click(createButton);

    const disclosureId = createButton.getAttribute("aria-controls");
    expect(createButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("button", { name: /cancel/i })[0]).toHaveAttribute("aria-controls", disclosureId);
    expect(document.getElementById(disclosureId ?? "")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: /cancel/i })[0]);

    expect(screen.getByRole("button", { name: /create new/i })).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(disclosureId ?? "")).not.toBeInTheDocument();
  });

  it("creates a routine and routes to the detail builder", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines" element={<RoutinesPage />} />
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /create new/i }));
    await user.type(screen.getByRole("textbox", { name: /routine name/i }), "Upper Strength");
    await user.click(screen.getByRole("button", { name: /create routine/i }));

    expect(await screen.findByRole("heading", { name: /upper strength builder/i })).toBeInTheDocument();
  });

  it("links each routine card to its detail route", () => {
    render(
      <MemoryRouter initialEntries={["/routines"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines" element={<RoutinesPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    expect(screen.getAllByRole("link", { name: /edit routine/i })[0]).toHaveAttribute(
      "href",
      "/routines/routine-upper-a",
    );
    expect(screen.queryByTestId("status-glyph")).not.toBeInTheDocument();
  });

  it("deletes a routine from the index with the trash action", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines" element={<RoutinesPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /^push$/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete push routine/i }));
    const dialog = screen.getByRole("alertdialog");

    expect(within(dialog).getByRole("heading", { name: /delete routine/i })).toBeInTheDocument();
    expect(within(dialog).getByText(/delete push\? this will remove the routine and its workout history/i)).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: /delete routine/i }));

    expect(screen.queryByRole("heading", { name: /^push$/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^pull$/i })).toBeInTheDocument();
    expect(screen.getByText(/2 routines available/i)).toBeInTheDocument();
  });

  it("does not delete a routine when the confirmation is cancelled", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines" element={<RoutinesPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /delete push routine/i }));
    const dialog = screen.getByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: /^cancel$/i }));

    expect(screen.getByRole("heading", { name: /^push$/i })).toBeInTheDocument();
    expect(screen.getByText(/3 routines available/i)).toBeInTheDocument();
  });
});
