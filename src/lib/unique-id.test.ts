import { describe, expect, it } from "vitest";
import { uniqueId } from "./unique-id";

describe("uniqueId", () => {
  it("returns the base id when it is not taken", () => {
    expect(uniqueId("routine-push", [])).toBe("routine-push");
    expect(uniqueId("routine-push", ["routine-upper-a"])).toBe("routine-push");
  });

  it("appends a numeric suffix starting at 2 when the base id is taken", () => {
    expect(uniqueId("routine-push", ["routine-push"])).toBe("routine-push-2");
  });

  it("increments the suffix while the id is still taken", () => {
    expect(uniqueId("routine-push", ["routine-push", "routine-push-2", "routine-push-3"])).toBe(
      "routine-push-4",
    );
  });

  it("supports a custom separator for name-based uniqueness", () => {
    expect(uniqueId("Push copy", ["Push copy"], " ")).toBe("Push copy 2");
    expect(uniqueId("Push copy", ["Push copy", "Push copy 2"], " ")).toBe("Push copy 3");
  });
});
