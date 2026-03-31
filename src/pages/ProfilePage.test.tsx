import { render, screen } from "@testing-library/react";
import ExercisesPage from "./ExercisesPage";
import ProfilePage from "./ProfilePage";
import RoutinesPage from "./RoutinesPage";
import { MemoryRouter } from "react-router-dom";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("ProfilePage", () => {
  it("shares the supporting copy treatment used by the other task 4 page headers", () => {
    const exercisesView = render(
      <GainlyStoreProvider>
        <ExercisesPage />
      </GainlyStoreProvider>,
    );
    const exercisesClassName = screen.getByText(/keep the shared movement catalog tidy/i).className;
    exercisesView.unmount();

    const routinesView = render(
      <MemoryRouter>
        <GainlyStoreProvider>
          <RoutinesPage />
        </GainlyStoreProvider>
      </MemoryRouter>
    );
    const routinesClassName = screen.getByText(
      /create new routines here, then open one to refine its exercises and set structure/i,
    ).className;
    routinesView.unmount();

    render(
      <GainlyStoreProvider>
        <ProfilePage />
      </GainlyStoreProvider>,
    );

    const supportingCopy = screen.getByText(
      /maintain a clear baseline of your current training footprint/i,
    );

    expect(supportingCopy.className).toBe(exercisesClassName);
    expect(supportingCopy.className).toBe(routinesClassName);
  });
});
