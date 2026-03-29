import { render, screen } from "@testing-library/react";
import ProfilePage from "./ProfilePage";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("ProfilePage", () => {
  it("uses the shared supporting copy treatment in the page header", () => {
    render(
      <GainlyStoreProvider>
        <ProfilePage />
      </GainlyStoreProvider>,
    );

    const supportingCopy = screen.getByText(
      /maintain a clear baseline of your current training footprint/i,
    );

    expect(supportingCopy).toHaveClass("text-sm", "text-[hsl(var(--muted-foreground))]");
    expect(supportingCopy).not.toHaveClass("max-w-2xl");
    expect(supportingCopy).not.toHaveClass("md:text-base");
  });
});
