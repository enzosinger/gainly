import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "./DashboardPage";
import { GainlyStoreProvider, useGainlyStore } from "../state/gainly-store";

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

  it("reorders routines when the store reorder action is triggered", async () => {
    const user = userEvent.setup();

    function ReorderProbe() {
      const { routines, reorderRoutines } = useGainlyStore();

      return (
        <div>
          <button
            type="button"
            onClick={() => reorderRoutines(["routine-upper-b", "routine-upper-a", "routine-lower-a"])}
          >
            Reorder
          </button>
          <ol>
            {routines.map((routine) => (
              <li key={routine.id}>{routine.name}</li>
            ))}
          </ol>
        </div>
      );
    }

    render(
      <GainlyStoreProvider>
        <ReorderProbe />
      </GainlyStoreProvider>,
    );

    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(["Push", "Pull", "Legs"]);

    await user.click(screen.getByRole("button", { name: /reorder/i }));

    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(["Legs", "Push", "Pull"]);
  });
});
