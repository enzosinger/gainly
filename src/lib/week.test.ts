import { describe, expect, it } from "vitest";
import { getWeekWindow } from "./week";

describe("week window localization", () => {
  it("formats the label using the provided locale", () => {
    const timestamp = new Date("2026-03-30T12:00:00Z").getTime();

    const english = getWeekWindow(timestamp, "en-US").label;
    const portuguese = getWeekWindow(timestamp, "pt-BR").label;

    expect(english).not.toEqual(portuguese);
    expect(english).toMatch(/Mar/i);
    expect(portuguese.toLowerCase()).toMatch(/mar|abr/);
  });
});
