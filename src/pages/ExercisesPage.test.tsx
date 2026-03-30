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
});
