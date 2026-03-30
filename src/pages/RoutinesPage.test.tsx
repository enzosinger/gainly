import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoutinesPage from "./RoutinesPage";
import { GainlyStoreProvider, useGainlyStore } from "../state/gainly-store";

function CreateExerciseProbe() {
  const { exercises, createExercise } = useGainlyStore();
  const duplicateExercises = exercises.filter((exercise) => exercise.name === "Custom Lift");

  return (
    <section>
      <button
        type="button"
        onClick={() => createExercise({ name: "Custom Lift", muscleGroup: "back" })}
      >
        Create duplicate
      </button>
      <ul>
        {duplicateExercises.map((exercise, index) => (
          <li key={`${exercise.id}-${index}`}>{exercise.id}</li>
        ))}
      </ul>
    </section>
  );
}

describe("RoutinesPage", () => {
  it("reflects the create-exercise disclosure open state accessibly", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <RoutinesPage />
      </GainlyStoreProvider>,
    );

    const createButton = screen.getByRole("button", { name: /create new/i });

    expect(createButton).toHaveAttribute("aria-expanded", "false");
    expect(createButton).toHaveAttribute("aria-controls");

    await user.click(createButton);

    const disclosureId = createButton.getAttribute("aria-controls");
    expect(createButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /cancel/i })).toHaveAttribute("aria-controls", disclosureId);
    expect(document.getElementById(disclosureId ?? "")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByRole("button", { name: /create new/i })).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(disclosureId ?? "")).not.toBeInTheDocument();
  });

  it("creates a custom exercise through the builder form with the selected muscle group", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <RoutinesPage />
      </GainlyStoreProvider>,
    );

    await user.click(screen.getByRole("button", { name: /create new/i }));

    expect(screen.getByRole("textbox", { name: /exercise name/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /muscle group/i })).toBeInTheDocument();
    expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);

    await user.type(screen.getByRole("textbox", { name: /exercise name/i }), "Face Pull");
    await user.selectOptions(screen.getByRole("combobox", { name: /muscle group/i }), "shoulders");
    await user.click(screen.getByRole("button", { name: /save exercise/i }));

    const createdExerciseCard = screen
      .getByRole("heading", { name: /face pull/i })
      .closest(".panel-card");

    expect(createdExerciseCard).not.toBeNull();
    expect(within(createdExerciseCard as HTMLElement).getByText(/shoulders/i)).toBeInTheDocument();
    expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);
  });

  it("starts with normal sets and lets the user add an advanced technique deliberately", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <RoutinesPage />
      </GainlyStoreProvider>,
    );

    expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);

    await user.click(screen.getAllByRole("button", { name: /add technique/i })[0]);

    const techniqueMenu = screen.getByRole("menu");
    expect(techniqueMenu).toBeVisible();
    expect(within(techniqueMenu).getByRole("menuitem", { name: /back-off set/i })).toBeVisible();
    expect(within(techniqueMenu).getByRole("menuitem", { name: /cluster set/i })).toBeVisible();
    expect(within(techniqueMenu).getByRole("menuitem", { name: /super set/i })).toBeVisible();

    await user.click(screen.getByRole("menuitem", { name: /back-off set/i }));
    expect(screen.getByText(/set 3 · backoff/i)).toBeInTheDocument();
  });

  it("switches the routine editor with the routine selector", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <RoutinesPage />
      </GainlyStoreProvider>,
    );

    expect(screen.getByRole("heading", { name: /push builder/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /barbell bench press/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: /routine/i }), "routine-lower-a");

    expect(screen.getByRole("heading", { name: /pull builder/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /barbell back squat/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /barbell bench press/i })).not.toBeInTheDocument();
  });

  it("filters the exercise picker by search text and muscle group", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <RoutinesPage />
      </GainlyStoreProvider>,
    );

    const searchInput = screen.getByRole("textbox", { name: /search exercises/i });
    const muscleGroupFilter = screen.getByRole("combobox", { name: /filter by muscle group/i });

    await user.type(searchInput, "curl");

    expect(screen.getByRole("button", { name: /incline dumbbell curl/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /barbell bench press/i })).not.toBeInTheDocument();

    await user.clear(searchInput);
    await user.selectOptions(muscleGroupFilter, "legs");

    expect(screen.getByRole("button", { name: /barbell back squat/i })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /barbell bench press/i })).not.toBeInTheDocument();
  });

  it("adds a normal set to a routine exercise", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <RoutinesPage />
      </GainlyStoreProvider>,
    );

    const benchHeading = screen.getByRole("heading", { name: /barbell bench press/i });
    const benchCard = benchHeading.parentElement?.parentElement;
    expect(benchCard).not.toBeNull();

    await user.click(within(benchCard as HTMLElement).getByRole("button", { name: /add set/i }));

    expect(within(benchCard as HTMLElement).getByText(/set 3 · normal/i)).toBeInTheDocument();
  });

  it("removes an exercise from the selected routine only", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <RoutinesPage />
      </GainlyStoreProvider>,
    );

    const benchHeading = screen.getByRole("heading", { name: /barbell bench press/i });
    const benchCard = benchHeading.parentElement?.parentElement;
    expect(benchCard).not.toBeNull();

    await user.click(within(benchCard as HTMLElement).getByRole("button", { name: /remove exercise/i }));

    expect(screen.queryByRole("heading", { name: /barbell bench press/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /seated cable row/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: /routine/i }), "routine-upper-b");
    expect(screen.getByRole("heading", { name: /incline dumbbell curl/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: /routine/i }), "routine-upper-a");
    expect(screen.queryByRole("heading", { name: /barbell bench press/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /seated cable row/i })).toBeInTheDocument();
  });

  it("creates unique ids when creating duplicate exercise names", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <CreateExerciseProbe />
      </GainlyStoreProvider>,
    );

    await user.click(screen.getByRole("button", { name: /create duplicate/i }));
    await user.click(screen.getByRole("button", { name: /create duplicate/i }));

    const ids = screen.getAllByRole("listitem").map((item) => item.textContent ?? "");
    expect(ids).toHaveLength(2);
    expect(new Set(ids).size).toBe(2);
  });

  it("distinguishes duplicate exercise names in the picker", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <CreateExerciseProbe />
        <RoutinesPage />
      </GainlyStoreProvider>,
    );

    await user.click(screen.getByRole("button", { name: /create duplicate/i }));
    await user.click(screen.getByRole("button", { name: /create duplicate/i }));

    const duplicateButtons = screen.getAllByRole("button", { name: /custom lift/i });
    expect(duplicateButtons).toHaveLength(2);

    const labels = duplicateButtons.map((button) => button.textContent ?? "");
    expect(labels).toEqual(expect.arrayContaining([expect.stringContaining("back · #1"), expect.stringContaining("back · #2")]));
  });
});
