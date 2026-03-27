import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoutinesPage from "./RoutinesPage";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("RoutinesPage", () => {
  it("starts with normal sets and lets the user add an advanced technique deliberately", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <RoutinesPage />
      </GainlyStoreProvider>,
    );

    await user.click(screen.getByRole("button", { name: /add technique/i }));
    expect(screen.getByRole("menuitem", { name: /back-off set/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /cluster set/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /super set/i })).toBeInTheDocument();
  });
});
