import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import WorkoutPage from "./WorkoutPage";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("WorkoutPage", () => {
  it("keeps all exercises visible while only one is expanded", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/workout/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/workout/:routineId" element={<WorkoutPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    const benchButton = screen.getByRole("button", { name: /bench press/i });
    const rowButton = screen.getByRole("button", { name: /seated cable row/i });

    expect(benchButton).toHaveAttribute("aria-expanded", "false");
    expect(rowButton).toHaveAttribute("aria-expanded", "false");

    await user.click(benchButton);
    expect(benchButton).toHaveAttribute("aria-expanded", "true");
    expect(rowButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText(/previous 80 kg x 6/i)).toBeInTheDocument();
    expect(screen.getByText(/previous 80 kg x 6/i).closest(".panel-inset")).toBeInTheDocument();

    await user.click(rowButton);
    expect(benchButton).toHaveAttribute("aria-expanded", "false");
    expect(rowButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/previous 65 kg x 10/i)).toBeInTheDocument();
    expect(screen.queryByText(/back-off: -10%/i)).not.toBeInTheDocument();
  });
});
