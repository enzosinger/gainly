import { render, screen } from "@testing-library/react";
import ExercisesPage from "./ExercisesPage";
import ProfilePage from "./ProfilePage";
import RoutinesPage from "./RoutinesPage";
import { MemoryRouter } from "react-router-dom";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("ProfilePage", () => {
  it("shares the header title treatment used by the other task 4 page headers", () => {
    const exercisesView = render(
      <GainlyStoreProvider>
        <ExercisesPage />
      </GainlyStoreProvider>,
    );
    const exercisesClassName = screen.getByRole("heading", { level: 1 }).className;
    exercisesView.unmount();

    const routinesView = render(
      <MemoryRouter>
        <GainlyStoreProvider>
          <RoutinesPage />
        </GainlyStoreProvider>
      </MemoryRouter>,
    );
    const routinesClassName = screen.getByRole("heading", { level: 1 }).className;
    routinesView.unmount();

    render(
      <GainlyStoreProvider>
        <ProfilePage />
      </GainlyStoreProvider>,
    );

    const profileTitle = screen.getByRole("heading", { level: 1 });

    expect(screen.getByRole("group", { name: /language/i })).toBeInTheDocument();
    expect(profileTitle.className).toBe(exercisesClassName);
    expect(profileTitle.className).toBe(routinesClassName);
  });

  it("renders the current-week volume section with one card per canonical muscle group", () => {
    render(
      <GainlyStoreProvider>
        <ProfilePage />
      </GainlyStoreProvider>,
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Current week volume",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("heading", {
        level: 3,
      }).map((heading) => heading.textContent),
    ).toEqual(["chest", "back", "shoulders", "quads", "hamstrings", "calves", "biceps", "triceps"]);
    expect(screen.getAllByText("Low volume")).toHaveLength(8);
    expect(screen.queryByText("Weekly sets")).not.toBeInTheDocument();
  });
});
