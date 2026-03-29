import { render, screen } from "@testing-library/react";
import { Select } from "./select";

describe("Select", () => {
  it("forwards props, semantic classes, and disabled affordances", () => {
    render(
      <Select aria-label="Training phase" defaultValue="strength" disabled name="phase">
        <option value="hypertrophy">Hypertrophy</option>
        <option value="strength">Strength</option>
      </Select>,
    );

    const select = screen.getByRole("combobox", { name: /training phase/i });

    expect(select).toHaveClass("border-[hsl(var(--border))]");
    expect(select).toHaveClass("disabled:cursor-not-allowed", "disabled:opacity-50");
    expect(select).toBeDisabled();
    expect(select).toHaveAttribute("name", "phase");
    expect(select).toHaveValue("strength");
  });
});
