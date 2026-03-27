import { render, screen } from "@testing-library/react";
import App from "./App";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("App shell", () => {
  it("shows the primary destinations", () => {
    render(
      <GainlyStoreProvider>
        <App />
      </GainlyStoreProvider>,
    );

    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /routines/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /exercises/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /profile/i })).toBeInTheDocument();
  });
});
