import { render, screen } from "@testing-library/react";
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
  it("starts with normal sets and lets the user add an advanced technique deliberately", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <RoutinesPage />
      </GainlyStoreProvider>,
    );

    expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);

    await user.click(screen.getAllByRole("button", { name: /add technique/i })[0]);
    expect(screen.getByRole("menuitem", { name: /back-off set/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /cluster set/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /super set/i })).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: /back-off set/i }));
    expect(screen.getByText(/set 3 · backoff/i)).toBeInTheDocument();
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
});
