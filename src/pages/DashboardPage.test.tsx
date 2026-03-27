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

    expect(screen.getByText(/push/i)).toBeInTheDocument();
    expect(screen.getByText(/pull/i)).toBeInTheDocument();
    expect(screen.getByText(/legs/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("status-glyph")).toHaveLength(3);
    expect(screen.getAllByTestId("status-glyph-upcoming")).toHaveLength(2);
    expect(screen.getAllByTestId("status-glyph-completed")).toHaveLength(1);
  });
});
