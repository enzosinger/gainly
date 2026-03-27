import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "./DashboardPage";
import { GainlyStoreProvider } from "../state/gainly-store";

vi.mock("@dnd-kit/core", async () => {
  const actual = await vi.importActual<typeof import("@dnd-kit/core")>("@dnd-kit/core");
  return {
    ...actual,
    DndContext: ({
      children,
      onDragEnd,
    }: {
      children: ReactNode;
      onDragEnd?: (event: { active: { id: string }; over: { id: string } | null }) => void;
    }) => (
      <div>
        {children}
        <button
          type="button"
          onClick={() =>
            onDragEnd?.({
              active: { id: "routine-upper-b" },
              over: { id: "routine-upper-a" },
            })
          }
        >
          Trigger reorder
        </button>
      </div>
    ),
  };
});

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

  it("reorders routines when weekly list drag ends with a new target", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <DashboardPage />
      </GainlyStoreProvider>,
    );

    expect(screen.getAllByRole("heading", { level: 3 }).map((item) => item.textContent)).toEqual([
      "Push",
      "Pull",
      "Legs",
    ]);

    await user.click(screen.getByRole("button", { name: /trigger reorder/i }));

    expect(screen.getAllByRole("heading", { level: 3 }).map((item) => item.textContent)).toEqual([
      "Legs",
      "Push",
      "Pull",
    ]);
  });
});
