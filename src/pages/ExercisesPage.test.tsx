import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExercisesPage from "./ExercisesPage";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("ExercisesPage", () => {
  it("deletes an exercise from the library with the trash action", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <ExercisesPage />
      </GainlyStoreProvider>,
    );

    expect(screen.getByRole("heading", { name: /barbell bench press/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /delete barbell bench press exercise/i }));
    const dialog = screen.getByRole("alertdialog");

    expect(within(dialog).getByRole("heading", { name: /delete exercise/i })).toBeInTheDocument();
    expect(within(dialog).getByText(/delete barbell bench press\? this will remove it from your routines and workout history/i)).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: /delete exercise/i }));

    expect(screen.queryByRole("heading", { name: /barbell bench press/i })).not.toBeInTheDocument();
  });

  it("cancels inline exercise edits without changing the card", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <ExercisesPage />
      </GainlyStoreProvider>,
    );

    await user.click(screen.getByRole("button", { name: /edit barbell bench press exercise/i }));
    await user.clear(screen.getByRole("textbox", { name: /exercise name/i }));
    await user.type(screen.getByRole("textbox", { name: /exercise name/i }), "Temporary Name");
    await user.click(screen.getByRole("button", { name: /cancel editing barbell bench press exercise/i }));

    expect(screen.getByRole("heading", { name: /barbell bench press/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /temporary name/i })).not.toBeInTheDocument();
  });

  it("keeps an exercise when the deletion confirmation is cancelled", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <ExercisesPage />
      </GainlyStoreProvider>,
    );

    await user.click(screen.getByRole("button", { name: /delete barbell bench press exercise/i }));
    const dialog = screen.getByRole("alertdialog");
    await user.click(within(dialog).getByRole("button", { name: /^cancel$/i }));

    expect(screen.getByRole("heading", { name: /barbell bench press/i })).toBeInTheDocument();
  });

  it("filters the exercise library by muscle group", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <ExercisesPage />
      </GainlyStoreProvider>,
    );

    expect(screen.getByRole("button", { name: /all muscle groups/i, pressed: true })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^back$/i }));

    expect(screen.getByRole("button", { name: /^back$/i, pressed: true })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /barbell bench press/i })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /seated cable row/i })).toBeInTheDocument();
  });

  it("creates a new library exercise directly on the exercises page", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <ExercisesPage />
      </GainlyStoreProvider>,
    );

    await user.click(screen.getByRole("button", { name: /create exercise/i }));

    await user.type(screen.getByRole("textbox", { name: /exercise name/i }), "Romanian Deadlift");
    await user.selectOptions(screen.getByRole("combobox", { name: /muscle group/i }), "legs");
    await user.type(
      screen.getByRole("textbox", { name: /description/i }),
      "Hinge with soft knees and keep the bar close.",
    );
    await user.click(screen.getByRole("button", { name: /save exercise/i }));

    const createdExerciseCard = screen.getByRole("heading", { name: /romanian deadlift/i }).closest(".panel-card");

    expect(createdExerciseCard).not.toBeNull();
    expect(within(createdExerciseCard as HTMLElement).getByText(/legs/i)).toBeInTheDocument();
    expect(
      within(createdExerciseCard as HTMLElement).getByText(/hinge with soft knees and keep the bar close/i),
    ).toBeInTheDocument();
  });

  it("edits an exercise inline from the library card", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <ExercisesPage />
      </GainlyStoreProvider>,
    );

    await user.click(screen.getByRole("button", { name: /edit barbell bench press exercise/i }));

    const nameInput = screen.getByRole("textbox", { name: /exercise name/i });
    await user.clear(nameInput);
    await user.type(nameInput, "Paused Bench Press");

    const descriptionInput = screen.getByRole("textbox", { name: /description/i });
    await user.type(descriptionInput, "Hold the pause on the chest before driving up.");

    await user.selectOptions(screen.getByRole("combobox", { name: /muscle group/i }), "shoulders");
    await user.click(screen.getByRole("button", { name: /confirm changes for barbell bench press exercise/i }));

    const updatedExerciseCard = screen.getByRole("heading", { name: /paused bench press/i }).closest(".panel-card");

    expect(updatedExerciseCard).not.toBeNull();
    expect(within(updatedExerciseCard as HTMLElement).getByText(/shoulders/i)).toBeInTheDocument();
    expect(
      within(updatedExerciseCard as HTMLElement).getByText(/hold the pause on the chest before driving up/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /confirm changes for barbell bench press exercise/i }),
    ).not.toBeInTheDocument();
  });
});
