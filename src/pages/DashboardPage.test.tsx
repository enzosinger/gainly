import { render, screen } from "@testing-library/react";
import DashboardPage from "./DashboardPage";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("DashboardPage", () => {
  it("shows all weekly routines with icon-based states", () => {
    render(
      <GainlyStoreProvider>
        <DashboardPage />
      </GainlyStoreProvider>,
    );

    expect(screen.getByText(/upper a/i)).toBeInTheDocument();
    expect(screen.getByText(/lower a/i)).toBeInTheDocument();
    expect(screen.getByText(/upper b/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("status-glyph").length).toBeGreaterThan(0);
  });
});
