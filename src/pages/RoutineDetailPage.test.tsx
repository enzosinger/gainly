import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import RoutineDetailPage from "./RoutineDetailPage";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("RoutineDetailPage", () => {
  it("reflects the create-exercise disclosure open state accessibly", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    const createButton = screen.getByRole("button", { name: /create new/i });

    expect(createButton).toHaveAttribute("aria-expanded", "false");
    expect(createButton).toHaveAttribute("aria-controls");

    await user.click(createButton);

    const disclosureId = createButton.getAttribute("aria-controls");
    expect(createButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /cancel/i })).toHaveAttribute("aria-controls", disclosureId);
    expect(document.getElementById(disclosureId ?? "")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(screen.getByRole("button", { name: /create new/i })).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(disclosureId ?? "")).not.toBeInTheDocument();
  });

  it("creates a custom exercise through the builder form with the selected muscle group", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /create new/i }));

    expect(screen.getByRole("textbox", { name: /exercise name/i })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /muscle group/i })).toBeInTheDocument();
    expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);

    await user.type(screen.getByRole("textbox", { name: /exercise name/i }), "Face Pull");
    await user.selectOptions(screen.getByRole("combobox", { name: /muscle group/i }), "shoulders");
    await user.click(screen.getByRole("button", { name: /save exercise/i }));

    const createdExerciseCard = screen
      .getByRole("heading", { name: /face pull/i })
      .closest(".panel-card");

    expect(createdExerciseCard).not.toBeNull();
    expect(within(createdExerciseCard as HTMLElement).getByText(/shoulders/i)).toBeInTheDocument();
    expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);
  });

  it("starts with normal sets and lets the user add an advanced technique deliberately", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);

    await user.click(screen.getAllByRole("button", { name: /add technique/i })[0]);

    const techniqueMenu = screen.getByRole("menu");
    expect(techniqueMenu).toBeVisible();
    expect(within(techniqueMenu).getByRole("menuitem", { name: /back-off set/i })).toBeVisible();
    expect(within(techniqueMenu).getByRole("menuitem", { name: /cluster set/i })).toBeVisible();
    expect(within(techniqueMenu).getByRole("menuitem", { name: /super set/i })).toBeVisible();

    await user.click(screen.getByRole("menuitem", { name: /back-off set/i }));
    expect(screen.getByText(/set 3 · backoff/i)).toBeInTheDocument();
  });

  it("switches the routine editor with the routine selector", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/routines/routine-upper-a"]}>
        <GainlyStoreProvider>
          <Routes>
            <Route path="/routines/:routineId" element={<RoutineDetailPage />} />
          </Routes>
        </GainlyStoreProvider>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /push builder/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /barbell bench press/i })).toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox", { name: /routine/i }), "routine-lower-a");

    expect(screen.getByRole("heading", { name: /pull builder/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /barbell back squat/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /barbell bench press/i })).not.toBeInTheDocument();
  });
});
