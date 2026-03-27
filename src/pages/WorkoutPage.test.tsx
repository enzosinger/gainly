import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkoutPage from "./WorkoutPage";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("WorkoutPage", () => {
  it("keeps all exercises visible while only one is expanded", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <WorkoutPage />
      </GainlyStoreProvider>,
    );

    await user.click(screen.getByRole("button", { name: /bench press/i }));
    expect(screen.getByText(/previous 80 kg x 8/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /seated cable row/i })).toBeInTheDocument();
  });

  it("only keeps one accordion expanded at a time", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <WorkoutPage />
      </GainlyStoreProvider>,
    );

    await user.click(screen.getByRole("button", { name: /bench press/i }));
    expect(screen.getByText(/previous 80 kg x 8/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /seated cable row/i }));
    expect(screen.getByText(/previous 80 kg x 8/i)).toBeInTheDocument();
    expect(screen.queryByText(/back-off: -10%/i)).not.toBeInTheDocument();
  });
});
