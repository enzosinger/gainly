import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";
import type { MutationCtx } from "./_generated/server";

export const PASSWORD_SIGN_IN_ATTEMPTS_PER_HOUR = 10;
export const PASSWORD_SIGN_UP_ATTEMPTS_PER_HOUR = 5;
export const AUTH_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const PASSWORD_SIGN_UP_SESSION_MARKER_PREFIX = "password:signUpSession:";
const PASSWORD_SIGN_UP_SESSION_MARKER_WINDOW_MS = 5 * 60 * 1000;

type RateLimitState = {
  attemptsLeft: number;
  lastAttemptTime: number;
};

type RateLimitOutcome =
  | {
      allowed: true;
      attemptsLeft: number;
    }
  | {
      allowed: false;
      attemptsLeft: number;
    };

export function normalizePasswordRateLimitEmail(email: string) {
  return email.trim().toLowerCase();
}

export function passwordRateLimitIdentifier(
  flow: "signIn" | "signUp",
  email: string,
) {
  return `password:${flow}:${normalizePasswordRateLimitEmail(email)}`;
}

function passwordSignUpSessionMarkerIdentifier(userId: string) {
  return `${PASSWORD_SIGN_UP_SESSION_MARKER_PREFIX}${userId}`;
}

export function calculateRateLimitOutcome(
  state: RateLimitState | null,
  now: number,
  maxAttemptsPerHour: number,
): RateLimitOutcome {
  const replenishedAttempts =
    state === null
      ? maxAttemptsPerHour
      : Math.min(
          maxAttemptsPerHour,
          state.attemptsLeft +
            ((now - state.lastAttemptTime) * maxAttemptsPerHour) /
              AUTH_RATE_LIMIT_WINDOW_MS,
        );

  if (replenishedAttempts < 1) {
    return {
      allowed: false,
      attemptsLeft: replenishedAttempts,
    };
  }

  return {
    allowed: true,
    attemptsLeft: replenishedAttempts - 1,
  };
}

async function consumePasswordRateLimit(
  ctx: MutationCtx,
  identifier: string,
  maxAttemptsPerHour: number,
) {
  const now = Date.now();
  const existingLimit = await ctx.db
    .query("authRateLimits")
    .withIndex("identifier", (q) => q.eq("identifier", identifier))
    .unique();

  const outcome = calculateRateLimitOutcome(
    existingLimit
      ? {
          attemptsLeft: existingLimit.attemptsLeft,
          lastAttemptTime: existingLimit.lastAttemptTime,
        }
      : null,
    now,
    maxAttemptsPerHour,
  );

  if (!outcome.allowed) {
    return false;
  }

  const nextState = {
    attemptsLeft: outcome.attemptsLeft,
    lastAttemptTime: now,
  };

  if (existingLimit === null) {
    await ctx.db.insert("authRateLimits", {
      identifier,
      ...nextState,
    });
  } else {
    await ctx.db.patch(existingLimit._id, nextState);
  }

  return true;
}

async function consumePasswordSignUpSessionMarker(ctx: MutationCtx, userId: string) {
  const identifier = passwordSignUpSessionMarkerIdentifier(userId);
  const marker = await ctx.db
    .query("authRateLimits")
    .withIndex("identifier", (q) => q.eq("identifier", identifier))
    .unique();

  if (marker === null) {
    return false;
  }

  if (Date.now() - marker.lastAttemptTime > PASSWORD_SIGN_UP_SESSION_MARKER_WINDOW_MS) {
    await ctx.db.delete(marker._id);
    return false;
  }

  await ctx.db.delete(marker._id);
  return true;
}

async function markPasswordSignUpSession(ctx: MutationCtx, userId: string) {
  const identifier = passwordSignUpSessionMarkerIdentifier(userId);
  const now = Date.now();
  const existingMarker = await ctx.db
    .query("authRateLimits")
    .withIndex("identifier", (q) => q.eq("identifier", identifier))
    .unique();

  if (existingMarker === null) {
    await ctx.db.insert("authRateLimits", {
      identifier,
      attemptsLeft: 1,
      lastAttemptTime: now,
    });
    return;
  }

  await ctx.db.patch(existingMarker._id, {
    attemptsLeft: 1,
    lastAttemptTime: now,
  });
}

async function limitPasswordLogin(
  ctx: MutationCtx,
  email: string,
) {
  const allowed = await consumePasswordRateLimit(
    ctx,
    passwordRateLimitIdentifier("signIn", email),
    PASSWORD_SIGN_IN_ATTEMPTS_PER_HOUR,
  );

  if (!allowed) {
    throw new Error("Too many login attempts.");
  }
}

async function limitPasswordSignup(
  ctx: MutationCtx,
  email: string,
) {
  const allowed = await consumePasswordRateLimit(
    ctx,
    passwordRateLimitIdentifier("signUp", email),
    PASSWORD_SIGN_UP_ATTEMPTS_PER_HOUR,
  );

  if (!allowed) {
    throw new Error("Too many sign-up attempts.");
  }
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        const email = params.email as string;
        if (typeof email !== "string" || email.trim() === "") {
          throw new Error("Invalid email");
        }

        return {
          email: normalizePasswordRateLimitEmail(email),
        };
      },
    }),
  ],
  callbacks: {
    async createOrUpdateUser(ctx, { existingUserId, profile, type }) {
      if (type !== "credentials") {
        throw new Error("Unsupported auth flow");
      }

      const email = profile.email;
      if (typeof email !== "string" || email.trim() === "") {
        throw new Error("Invalid email");
      }

      await limitPasswordSignup(ctx, email);

      const normalizedEmail = normalizePasswordRateLimitEmail(email);

      if (existingUserId !== null) {
        await ctx.db.patch(existingUserId, {
          email: normalizedEmail,
        });
        return existingUserId;
      }

      const userId = await ctx.db.insert("users", {
        email: normalizedEmail,
      });

      await markPasswordSignUpSession(ctx, userId);

      return userId;
    },
    async beforeSessionCreation(ctx, { userId }) {
      if (await consumePasswordSignUpSessionMarker(ctx, userId)) {
        return;
      }

      const user = await ctx.db.get(userId);
      const email = user?.email;

      if (typeof email !== "string" || email.trim() === "") {
        throw new Error("Invalid email");
      }

      await limitPasswordLogin(ctx, email);
    },
  },
});
