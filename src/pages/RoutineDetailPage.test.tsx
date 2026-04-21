import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, vi } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RoutineDetailPage from "./RoutineDetailPage";
import { GainlyStoreProvider } from "../state/gainly-store";
import * as gainlyStore from "../state/gainly-store";

describe("RoutineDetailPage", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a loading state while the routine editor hydrates", () => {
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
      updateRoutineExerciseRepRange: vi.fn(),
      updateRoutineExerciseWarmupSets: vi.fn(),
      updateRoutineExerciseFeederSets: vi.fn(),
      createExercise: vi.fn(),
      updateExercise: vi.fn(),
      deleteExercise: vi.fn(),
      signOut: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-a"]}>
        <Routes>
          <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByRole("status", { name: /connecting to your training workspace/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /routine not found/i })).not.toBeInTheDocument();
  });

  it("reflects the create-exercise disclosure open state accessibly", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
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
    expect(createButton).toHaveTextContent(/collapse add exercise/i);
    expect(createButton).toHaveAttribute("aria-controls", disclosureId);
    expect(document.getElementById(disclosureId ?? "")).toBeInTheDocument();

    await user.click(createButton);

    expect(screen.getByRole("button", { name: /create new/i })).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(disclosureId ?? "")).not.toBeInTheDocument();
  });

  it("creates a custom exercise through the builder form with the selected muscle group", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /create new/i }));

    expect(screen.getByRole("textbox", { name: /exercise name/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /muscle group/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /description/i })).toBeInTheDocument();
    expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);

    await user.type(screen.getByRole("textbox", { name: /exercise name/i }), "Face Pull");
    await user.selectOptions(screen.getByRole("combobox", { name: /muscle group/i }), "shoulders");
    await user.type(screen.getByRole("textbox", { name: /description/i }), "Upper back and rear delt work");
    await user.click(screen.getByRole("button", { name: /save exercise/i }));

    const createdExerciseCard = screen
      .getByRole("heading", { name: /face pull/i })
      .closest(".panel-card");

    expect(createdExerciseCard).not.toBeNull();
    expect(within(createdExerciseCard as HTMLElement).getByText(/shoulders/i)).toBeInTheDocument();
    expect(
      within(createdExerciseCard as HTMLElement).getByText(/upper back and rear delt work/i),
    ).toBeInTheDocument();
    expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);
  });

  it("uses the shared lower-body taxonomy in the routine builder create form", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /create new/i }));

    const muscleGroupSelect = screen.getByRole("combobox", { name: /muscle group/i });

    expect(within(muscleGroupSelect).getByRole("option", { name: /^quads$/i })).toBeInTheDocument();
    expect(within(muscleGroupSelect).getByRole("option", { name: /^hamstrings$/i })).toBeInTheDocument();
    expect(within(muscleGroupSelect).getByRole("option", { name: /^calves$/i })).toBeInTheDocument();
    expect(within(muscleGroupSelect).queryByRole("option", { name: /^legs$/i })).not.toBeInTheDocument();
  });

  it("removes superset from the technique menu", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);

    await user.click(screen.getAllByRole("button", { name: /add technique/i })[0]);

    const techniqueMenu = screen.getByRole("menu");
    expect(techniqueMenu).toBeVisible();
    expect(within(techniqueMenu).getByRole("menuitem", { name: /back-off set/i })).toBeVisible();
    expect(within(techniqueMenu).getByRole("menuitem", { name: /cluster set/i })).toBeVisible();
    expect(within(techniqueMenu).queryByRole("menuitem", { name: /super set/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: /back-off set/i }));
    expect(screen.getByText(/set 3 · back-off/i)).toBeInTheDocument();
  });

  it("creates a superset from the picker by selecting two different exercises", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /expand add/i }));
    await user.click(screen.getByRole("button", { name: /add superset/i }));

    expect(screen.getByText(/select the first exercise/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /barbell bench press/i }));
    expect(screen.getByText(/select the second exercise/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /seated cable row/i }));

    expect(screen.getByRole("heading", { name: /barbell bench press \+ seated cable row/i })).toBeInTheDocument();
  });

  it("appends a superset set when adding a set to a superset exercise", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-b"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getAllByRole("button", { name: /add set/i })[1]);

    expect(screen.getByText(/set 2 · superset/i)).toBeInTheDocument();
  });

  it("updates exercise rep range in the routine builder", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    const minInput = screen.getAllByRole("spinbutton", { name: /minimum reps/i })[0];
    const maxInput = screen.getAllByRole("spinbutton", { name: /maximum reps/i })[0];

    await user.clear(minInput);
    await user.type(minInput, "6");
    await user.clear(maxInput);
    await user.type(maxInput, "9");

    expect(minInput).toHaveValue(6);
    expect(maxInput).toHaveValue(9);
  });

  it("switches the routine editor with the routine selector", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /push builder/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /barbell bench press/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: /routine/i }), "routine-lower-a");

    expect(screen.getByRole("heading", { name: /pull builder/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /barbell back squat/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /barbell bench press/i })).not.toBeInTheDocument();
  });
});
