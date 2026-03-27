import { render, screen } from "@testing-library/react";
import App from "./App";
import { GainlyStoreProvider } from "../state/gainly-store";
import { renderWithAppRouter } from "../test/test-utils";

describe("App shell", () => {
  it("renders each primary destination route", async () => {
    const dashboard = renderWithAppRouter(["/"]);
    expect(await screen.findByRole("heading", { name: /your training week/i })).toBeInTheDocument();
    dashboard.unmount();

    const routines = renderWithAppRouter(["/routines"]);
    expect(await screen.findByRole("heading", { name: /push builder/i })).toBeInTheDocument();
    routines.unmount();

    const exercises = renderWithAppRouter(["/exercises"]);
    expect(await screen.findByRole("heading", { name: /reusable movements/i })).toBeInTheDocument();
    exercises.unmount();

    const profile = renderWithAppRouter(["/profile"]);
    expect(await screen.findByRole("heading", { name: /profile/i })).toBeInTheDocument();
    profile.unmount();

    const workout = renderWithAppRouter(["/workout"]);
    expect(await screen.findByRole("heading", { name: /push workout/i })).toBeInTheDocument();
    workout.unmount();
  });

  it("exposes a dashboard link to the workout logger", async () => {
    renderWithAppRouter(["/"]);
    expect(await screen.findByRole("link", { name: /^log push workout$/i })).toHaveAttribute(
      "href",
      "/workout/routine-upper-a",
    );
  });

  it("renders the full profile analytics page content", async () => {
    renderWithAppRouter(["/profile"]);
    expect(await screen.findByText(/athlete profile/i)).toBeInTheDocument();
    expect(screen.getByText(/weekly sets/i)).toBeInTheDocument();
  });
});

describe("visual shell", () => {
  it("renders the mobile navigation and premium heading treatment", () => {
    render(
      <GainlyStoreProvider>
        <App />
      </GainlyStoreProvider>,
    );

    expect(screen.getAllByRole("link", { name: /dashboard/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/your training week/i)).toBeInTheDocument();
  });
});
