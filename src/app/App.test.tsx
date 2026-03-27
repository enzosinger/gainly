import { screen } from "@testing-library/react";
import { renderWithAppRouter } from "../test/test-utils";

describe("App shell", () => {
  it("renders each primary destination route", async () => {
    const dashboard = renderWithAppRouter(["/"]);
    expect(await screen.findByRole("heading", { name: /dashboard/i })).toBeInTheDocument();
    dashboard.unmount();

    const routines = renderWithAppRouter(["/routines"]);
    expect(await screen.findByRole("heading", { name: /routines/i })).toBeInTheDocument();
    routines.unmount();

    const exercises = renderWithAppRouter(["/exercises"]);
    expect(await screen.findByRole("heading", { name: /exercises/i })).toBeInTheDocument();
    exercises.unmount();

    const profile = renderWithAppRouter(["/profile"]);
    expect(await screen.findByRole("heading", { name: /profile/i })).toBeInTheDocument();
    profile.unmount();
  });
});
