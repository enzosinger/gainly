import { describe, expect, it } from "vitest";
import {
  AUTH_RATE_LIMIT_WINDOW_MS,
  calculateRateLimitOutcome,
  passwordRateLimitIdentifier,
} from "./auth";

describe("password auth rate limiting", () => {
  it("normalizes email addresses into a stable identifier", () => {
    expect(passwordRateLimitIdentifier("signIn", "  Test@Example.com  ")).toBe(
      "password:signIn:test@example.com",
    );
  });

  it("consumes one attempt immediately when no prior state exists", () => {
    expect(calculateRateLimitOutcome(null, 0, 10)).toEqual({
      allowed: true,
      attemptsLeft: 9,
    });
  });

  it("refills attempts over time before consuming one", () => {
    expect(
      calculateRateLimitOutcome(
        { attemptsLeft: 0, lastAttemptTime: 0 },
        AUTH_RATE_LIMIT_WINDOW_MS / 2,
        10,
      ),
    ).toEqual({
      allowed: true,
      attemptsLeft: 4,
    });
  });

  it("blocks when the bucket has not refilled enough", () => {
    expect(
      calculateRateLimitOutcome(
        { attemptsLeft: 0, lastAttemptTime: 0 },
        AUTH_RATE_LIMIT_WINDOW_MS / 10,
        5,
      ),
    ).toEqual({
      allowed: false,
      attemptsLeft: 0.5,
    });
  });
});
