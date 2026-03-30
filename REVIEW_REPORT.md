# REVIEW_REPORT

## Task

Routines flow update for routine creation and routine detail routing, plus Monday-to-Sunday week navigation for dashboard and workout history review.

## Risk Level

L2

## Review Scope

- routing and page ownership in `src/app/router.tsx`, `src/pages/RoutinesPage.tsx`, `src/pages/RoutineDetailPage.tsx`, `src/pages/DashboardPage.tsx`, `src/pages/WorkoutPage.tsx`
- week-window UI and card rendering in `src/components/organisms/dashboard/WeekStrip.tsx`, `src/components/organisms/dashboard/WeeklyRoutineList.tsx`, `src/components/molecules/RoutineWeekCard.tsx`, `src/lib/week.ts`
- store and type changes in `src/state/gainly-store.tsx`, `src/types/domain.ts`
- backend mutations and queries in `convex/routines.ts`, `convex/workouts.ts`
- regression coverage in `src/pages/RoutinesPage.test.tsx`, `src/pages/RoutineDetailPage.test.tsx`, `src/pages/WorkoutPage.test.tsx`, `src/pages/DashboardPage.test.tsx`, `src/app/App.test.tsx`

## Performance Review

### Scope

Implementation review of the new week-window data access and the routines index/detail flow, especially `convex/workouts.ts`, `convex/routines.ts`, `src/pages/DashboardPage.tsx`, and `src/pages/WorkoutPage.tsx`.

### Risk Summary

The main performance concern was whether week navigation would trigger unbounded history reads or per-routine query fan-out. The implemented change keeps the new history path bounded by a Monday-to-Sunday window and avoids adding a dashboard query per routine card.

### Findings

- No performance findings identified.

### Recommended Changes

- None.

### Residual Risks

- The older `progressSummaries` query still collects full completed-session history per routine for non-week-scoped progress surfaces. That path was pre-existing and not expanded by this task, but it remains a longer-term scaling consideration.
- No production measurements were taken; this review relied on code inspection plus local typecheck, targeted tests, and build output.

### Decision

Decision: approved

## Security Review

### Scope

Implementation review of authenticated routine creation and week-history queries in `convex/routines.ts` and `convex/workouts.ts`, plus the route/page consumers that invoke those APIs.

### Threat Summary

The relevant trust boundaries are authenticated routine creation, user-scoped routine editing, and user-scoped workout history reads. The main risks were missing ownership checks, trusting client-only route state, or broadening history access beyond the current user.

### Findings

- No security findings identified.

### Recommended Changes

- None.

### Residual Risks

- Security still depends on the existing `requireCurrentUserId`, `requireRoutine`, and `requireExercise` backend ownership checks remaining the source of truth for future mutations and queries.
- Manual live verification against a real authenticated Convex backend was not performed in this pass.

### Decision

Decision: approved

## Overall Status

Review Status: Pass
