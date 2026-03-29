# Gainly B2 Frontend Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the in-progress B2 Monochrome Athletic redesign on the existing local UI layer so the shell, primitives, and five current pages feel visually consistent and future-ready for dark mode tokens.

**Architecture:** Keep the current React, Vite, Tailwind, and local store structure intact. Centralize visual roles in semantic CSS variables and local UI primitives first, then refit the shell and page-level components onto that system without introducing official `shadcn/ui` or broader product scope.

**Tech Stack:** React, TypeScript, Vite, Tailwind CSS, React Router, Testing Library, Vitest

---

## File Structure

### Shared Styling And Shell

- Modify: `src/styles/globals.css`
  - Define the semantic B2 token set and shared utility classes for page backgrounds, panel layers, text roles, and focus states.
- Modify: `src/app/layouts/AppShell.tsx`
  - Make the desktop rail and mobile nav follow the B2 shell rules and consume the updated tokens.
- Test: `src/app/App.test.tsx`
  - Lock in the shell structure and high-level navigation layout expectations without asserting fragile cosmetics.

### Local UI Layer

- Modify: `src/components/ui/button.tsx`
  - Move button variants to semantic token-backed classes instead of hardcoded `zinc-*`.
- Modify: `src/components/ui/card.tsx`
  - Standardize panel, inset, and heading spacing treatment for page surfaces.
- Modify: `src/components/ui/badge.tsx`
  - Align badges to the monochrome metadata system.
- Modify: `src/components/ui/input.tsx`
  - Align input surfaces and focus treatment to token-backed styles.
- Create: `src/components/ui/select.tsx`
  - Provide a local select-like primitive for the routine builder so forms stop mixing primitives with raw custom styling.

### Page And Organism Consistency

- Modify: `src/components/molecules/RoutineWeekCard.tsx`
  - Bring dashboard routine cards onto the B2 panel hierarchy.
- Modify: `src/components/organisms/dashboard/WeekStrip.tsx`
  - Align the week strip with the same panel and inset language as the dashboard cards.
- Modify: `src/components/organisms/dashboard/WeeklyRoutineList.tsx`
  - Preserve behavior while aligning spacing with the updated shell rhythm.
- Modify: `src/components/organisms/logger/ExerciseAccordion.tsx`
  - Make collapsed and expanded states use the shared surface layers.
- Modify: `src/components/molecules/SetRow.tsx`
  - Normalize inset panel treatment for set rows and technique details.
- Modify: `src/components/organisms/logger/TechniqueBadgeRow.tsx`
  - Align technique badges with the monochrome metadata system.
- Modify: `src/components/organisms/routine-builder/ExercisePicker.tsx`
  - Replace raw select styling with the local select primitive and align form surfaces with B2.
- Modify: `src/components/organisms/routine-builder/RoutineExerciseEditor.tsx`
  - Apply the refined card and inset hierarchy to builder items.
- Modify: `src/components/organisms/library/ExerciseLibraryList.tsx`
  - Bring library cards and metadata into the same rhythm as routines and profile.
- Modify: `src/pages/DashboardPage.tsx`
- Modify: `src/pages/WorkoutPage.tsx`
- Modify: `src/pages/RoutinesPage.tsx`
- Modify: `src/pages/ExercisesPage.tsx`
- Modify: `src/pages/ProfilePage.tsx`
  - Unify header rhythm, supporting copy tone, spacing, and panel usage across all five pages.

### Product Cleanup And Tests

- Modify: `src/types/domain.ts`
  - Confirm the active runtime model remains free of `unilateral`.
- Modify: `src/state/gainly-store.tsx`
  - Keep store behavior intact while preserving model cleanup.
- Modify: `src/data/mockExercises.ts`
- Modify: `src/data/mockRoutines.ts`
  - Keep mock content aligned with B2 naming and the current product model.
- Modify: `src/pages/RoutinesPage.test.tsx`
  - Cover the select primitive swap and preserve the no-`unilateral` assertion.
- Modify: `src/pages/WorkoutPage.test.tsx`
  - Preserve accordion behavior after the visual refactor.
- Modify: `src/app/App.test.tsx`
  - Verify shell structure still matches the B2 direction after the shell rewrite.

### Documentation

- Modify: `docs/superpowers/handoffs/2026-03-28-session-handoff.md`
  - Update the “next step” and active direction summary after implementation is complete.

## Task 1: Lock The B2 Token System And Primitive API

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/components/ui/button.tsx`
- Modify: `src/components/ui/card.tsx`
- Modify: `src/components/ui/badge.tsx`
- Modify: `src/components/ui/input.tsx`
- Create: `src/components/ui/select.tsx`
- Test: `src/app/App.test.tsx`

- [ ] **Step 1: Write the failing tests for shell-safe token adoption**

Add or adjust shell-level assertions in `src/app/App.test.tsx` so the tests expect semantic class usage rather than old one-off utility assumptions:

```tsx
it("renders the B2 shell with semantic surface classes", () => {
  render(<App />);

  const desktopNavigation = screen.getByRole("navigation", { name: /primary navigation/i });
  const mobileNavigation = screen.getByRole("navigation", { name: /primary mobile navigation/i });
  const mainRegion = screen.getByRole("main");

  expect(desktopNavigation.closest("aside")).toHaveClass("app-shell-sidebar");
  expect(mobileNavigation).toHaveClass("app-shell-mobile-nav");
  expect(mainRegion).toHaveClass("app-shell-main");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- --runInBand src/app/App.test.tsx`
Expected: FAIL because `AppShell.tsx` does not yet expose the semantic shell classes.

- [ ] **Step 3: Implement semantic tokens and local primitives**

Update `src/styles/globals.css` with semantic roles instead of direct page-level `zinc-*` assumptions:

```css
:root {
  --background: 0 0% 97%;
  --foreground: 240 10% 4%;
  --panel: 0 0% 100%;
  --panel-inset: 240 5% 96%;
  --border: 240 6% 88%;
  --muted-foreground: 240 4% 40%;
  --strong: 240 8% 8%;
  --ring: 240 8% 8%;
}

@layer components {
  .app-shell-sidebar { @apply min-h-screen border-r; background-color: hsl(var(--panel)); border-color: hsl(var(--border)); }
  .app-shell-main { @apply flex-1 px-4 pb-24 pt-6 md:px-10 md:pb-10 md:pt-10; }
  .app-shell-mobile-nav { @apply fixed inset-x-3 bottom-3 z-20 rounded-xl border p-2 shadow-sm md:hidden; background-color: hsl(var(--panel)); border-color: hsl(var(--border)); }
  .panel-card { @apply rounded-xl border shadow-sm; background-color: hsl(var(--panel)); border-color: hsl(var(--border)); }
  .panel-inset { @apply rounded-md border; background-color: hsl(var(--panel-inset)); border-color: hsl(var(--border)); }
}
```

Update local primitives to consume the tokens:

```tsx
const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-[hsl(var(--strong))] text-white hover:opacity-95",
  outline: "border border-[hsl(var(--border))] bg-[hsl(var(--panel))] text-[hsl(var(--foreground))] hover:bg-[hsl(var(--panel-inset))]",
  secondary: "bg-[hsl(var(--panel-inset))] text-[hsl(var(--foreground))] hover:opacity-95",
  ghost: "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--panel-inset))] hover:text-[hsl(var(--foreground))]",
};
```

Create `src/components/ui/select.tsx` as a lightweight wrapper around `<select>`:

```tsx
import * as React from "react";
import { cn } from "../../lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-2 text-sm text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));

Select.displayName = "Select";

export { Select };
```

- [ ] **Step 4: Run the focused test to verify the new shell-safe surface hooks pass**

Run: `npm test -- --runInBand src/app/App.test.tsx`
Expected: PASS for the semantic shell class test.

- [ ] **Step 5: Commit the primitive foundation**

```bash
git add src/styles/globals.css src/components/ui/button.tsx src/components/ui/card.tsx src/components/ui/badge.tsx src/components/ui/input.tsx src/components/ui/select.tsx src/app/App.test.tsx
git commit -m "refactor: add semantic B2 design tokens"
```

## Task 2: Rebuild The App Shell Around The B2 Frame

**Files:**
- Modify: `src/app/layouts/AppShell.tsx`
- Modify: `src/app/App.test.tsx`

- [ ] **Step 1: Write the failing shell-structure assertions**

Extend `src/app/App.test.tsx` to check for the stronger rail and mobile-nav hooks:

```tsx
it("renders the desktop rail and mobile nav as one shell system", () => {
  render(<App />);

  const desktopAside = screen.getByRole("navigation", { name: /primary navigation/i }).closest("aside");
  const mobileNavigation = screen.getByRole("navigation", { name: /primary mobile navigation/i });

  expect(desktopAside).toHaveClass("app-shell-sidebar");
  expect(mobileNavigation).toHaveClass("app-shell-mobile-nav");
  expect(screen.getByText(/monochrome athletic/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the shell test to verify it fails**

Run: `npm test -- --runInBand src/app/App.test.tsx`
Expected: FAIL because the current shell layout still uses old raw class clusters.

- [ ] **Step 3: Implement the B2 shell rewrite in `AppShell.tsx`**

Refactor the shell to use shared classes and simpler stateful nav styling:

```tsx
<div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] md:grid md:grid-cols-[280px_1fr]">
  <aside className="app-shell-sidebar hidden md:flex md:flex-col">
    <div className="flex h-full flex-col px-6 py-8">
      <div className="eyebrow">Gainly</div>
      <p className="mt-3 text-xl font-semibold tracking-tight">Training OS</p>
      <nav aria-label="Primary navigation" className="mt-10 flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "rounded-md px-4 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-[hsl(var(--strong))] text-white"
                  : "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--panel-inset))] hover:text-[hsl(var(--foreground))]",
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="panel-inset mt-auto p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">Mode</p>
        <p className="mt-2 text-sm font-medium text-[hsl(var(--foreground))]">Monochrome Athletic</p>
      </div>
    </div>
  </aside>
  <div className="flex min-h-screen flex-col">
    <main className="app-shell-main">
      <Outlet />
    </main>
    <nav aria-label="Primary mobile navigation" className="app-shell-mobile-nav">
```

- [ ] **Step 4: Run the shell tests to verify the B2 frame passes**

Run: `npm test -- --runInBand src/app/App.test.tsx`
Expected: PASS with the updated shell assertions.

- [ ] **Step 5: Commit the shell rewrite**

```bash
git add src/app/layouts/AppShell.tsx src/app/App.test.tsx
git commit -m "refactor: align app shell with B2 frame"
```

## Task 3: Apply The Shared Surface System To Dashboard And Logger

**Files:**
- Modify: `src/components/molecules/RoutineWeekCard.tsx`
- Modify: `src/components/organisms/dashboard/WeekStrip.tsx`
- Modify: `src/components/organisms/dashboard/WeeklyRoutineList.tsx`
- Modify: `src/components/organisms/logger/ExerciseAccordion.tsx`
- Modify: `src/components/molecules/SetRow.tsx`
- Modify: `src/components/organisms/logger/TechniqueBadgeRow.tsx`
- Modify: `src/pages/DashboardPage.tsx`
- Modify: `src/pages/WorkoutPage.tsx`
- Test: `src/app/App.test.tsx`
- Test: `src/pages/WorkoutPage.test.tsx`

- [ ] **Step 1: Write the failing tests for logger behavior preservation**

Keep `src/pages/WorkoutPage.test.tsx` behavior-focused while adding one structure check that the expanded region uses the inset treatment:

```tsx
await user.click(benchButton);

expect(screen.getByText(/previous 80 kg x 6/i)).toBeInTheDocument();
expect(screen.getByText(/previous 80 kg x 6/i).closest(".panel-inset")).toBeInTheDocument();
```

- [ ] **Step 2: Run the dashboard/logger tests to verify they fail**

Run: `npm test -- --runInBand src/pages/WorkoutPage.test.tsx src/app/App.test.tsx`
Expected: FAIL because the logger currently uses raw `zinc-*` containers instead of `.panel-inset`.

- [ ] **Step 3: Refit dashboard and logger components onto the shared surfaces**

Apply the updated panel language without changing behavior:

```tsx
// src/components/organisms/dashboard/WeekStrip.tsx
<div className="panel-card grid grid-cols-7 gap-2 p-2">
  {weekDays.map((day) => (
    <div
      key={day}
      className={cn(
        "rounded-md px-2 py-2 text-center text-xs uppercase tracking-[0.14em]",
        day === "Fri"
          ? "bg-[hsl(var(--strong))] text-white"
          : "text-[hsl(var(--muted-foreground))]",
      )}
    >
      {day}
    </div>
  ))}
</div>
```

```tsx
// src/components/molecules/SetRow.tsx
<div className="panel-inset space-y-2 p-3 text-sm text-[hsl(var(--foreground))]">
  <div className="grid grid-cols-[44px_1fr_1fr] gap-2">
    <div className="text-[hsl(var(--muted-foreground))]">{index + 1}</div>
    <div>{formatWeight(set.weightKg)}</div>
    <div>{formatReps(set)}</div>
  </div>
</div>
```

```tsx
// src/components/organisms/logger/ExerciseAccordion.tsx
<section className="panel-card">
  <button ... className="flex w-full items-center justify-between px-4 py-4 text-left text-[hsl(var(--foreground))]">
  {expanded ? (
    <div className="space-y-3 border-t border-[hsl(var(--border))] px-4 py-4">
      <div className="panel-inset px-3 py-2">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{getPreviousPerformance(item)}</p>
      </div>
```

- [ ] **Step 4: Run the focused tests to verify behavior still passes**

Run: `npm test -- --runInBand src/pages/WorkoutPage.test.tsx src/app/App.test.tsx`
Expected: PASS, with accordion behavior unchanged and structure assertions satisfied.

- [ ] **Step 5: Commit the dashboard and logger consistency pass**

```bash
git add src/components/molecules/RoutineWeekCard.tsx src/components/organisms/dashboard/WeekStrip.tsx src/components/organisms/dashboard/WeeklyRoutineList.tsx src/components/organisms/logger/ExerciseAccordion.tsx src/components/molecules/SetRow.tsx src/components/organisms/logger/TechniqueBadgeRow.tsx src/pages/DashboardPage.tsx src/pages/WorkoutPage.tsx src/pages/WorkoutPage.test.tsx src/app/App.test.tsx
git commit -m "refactor: unify dashboard and logger surfaces"
```

## Task 4: Apply The Shared Surface System To Builder, Library, And Profile

**Files:**
- Modify: `src/components/organisms/routine-builder/ExercisePicker.tsx`
- Modify: `src/components/organisms/routine-builder/RoutineExerciseEditor.tsx`
- Modify: `src/components/organisms/library/ExerciseLibraryList.tsx`
- Modify: `src/pages/RoutinesPage.tsx`
- Modify: `src/pages/ExercisesPage.tsx`
- Modify: `src/pages/ProfilePage.tsx`
- Modify: `src/pages/RoutinesPage.test.tsx`

- [ ] **Step 1: Write the failing tests for the builder flow after the select swap**

Add an assertion that the create form still exposes an accessible combobox and still omits `unilateral`:

```tsx
await user.click(screen.getByRole("button", { name: /create new/i }));

expect(screen.getByRole("textbox", { name: /exercise name/i })).toBeInTheDocument();
expect(screen.getByRole("combobox", { name: /muscle group/i })).toBeInTheDocument();
expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);
```

- [ ] **Step 2: Run the routines page test to verify it fails**

Run: `npm test -- --runInBand src/pages/RoutinesPage.test.tsx`
Expected: FAIL if the refactor has not yet added the shared select primitive or if labels are not connected correctly.

- [ ] **Step 3: Implement the builder/library/profile consistency pass**

Replace the raw builder select and align the remaining screens to shared panels:

```tsx
// src/components/organisms/routine-builder/ExercisePicker.tsx
import { Select } from "../../ui/select";

<label className="block text-sm">
  <span className="block text-[hsl(var(--muted-foreground))]">Muscle group</span>
  <Select
    value={muscleGroup}
    onChange={(event) => setMuscleGroup(event.target.value as MuscleGroup)}
    className="mt-2"
  >
    {muscleGroupOptions.map((option) => (
      <option key={option} value={option}>
        {option}
      </option>
    ))}
  </Select>
</label>
```

```tsx
// src/pages/ProfilePage.tsx
<div className="grid gap-4 sm:grid-cols-3">
  <Card>
    <CardHeader className="pb-3">
      <p className="eyebrow">Routines</p>
    </CardHeader>
    <CardContent>
      <p className="text-3xl font-semibold">{routines.length}</p>
    </CardContent>
  </Card>
</div>
```

Use the same page-header rhythm across `RoutinesPage.tsx`, `ExercisesPage.tsx`, and `ProfilePage.tsx`:

```tsx
<section className="space-y-6 md:space-y-8">
  <header className="space-y-2">
    <p className="eyebrow">Exercise Library</p>
    <h1 className="screen-title">Exercises</h1>
    <p className="max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">
      Review your current movement library with the same monochrome structure used across planning and logging.
    </p>
  </header>
</section>
```

- [ ] **Step 4: Run the routines page tests to verify behavior still passes**

Run: `npm test -- --runInBand src/pages/RoutinesPage.test.tsx`
Expected: PASS with the deliberate technique flow and duplicate-ID creation still working.

- [ ] **Step 5: Commit the builder, library, and profile pass**

```bash
git add src/components/organisms/routine-builder/ExercisePicker.tsx src/components/organisms/routine-builder/RoutineExerciseEditor.tsx src/components/organisms/library/ExerciseLibraryList.tsx src/pages/RoutinesPage.tsx src/pages/ExercisesPage.tsx src/pages/ProfilePage.tsx src/pages/RoutinesPage.test.tsx
git commit -m "refactor: align builder library and profile with B2"
```

## Task 5: Final Cleanup, `unilateral` Verification, And Full Validation

**Files:**
- Modify: `src/types/domain.ts`
- Modify: `src/state/gainly-store.tsx`
- Modify: `src/data/mockExercises.ts`
- Modify: `src/data/mockRoutines.ts`
- Modify: `docs/superpowers/handoffs/2026-03-28-session-handoff.md`
- Test: `src/app/App.test.tsx`
- Test: `src/pages/RoutinesPage.test.tsx`
- Test: `src/pages/WorkoutPage.test.tsx`

- [ ] **Step 1: Write the final verification checks before cleanup**

Add or preserve assertions that protect the product-model cleanup:

```tsx
expect(screen.queryAllByText(/unilateral|bilateral/i)).toHaveLength(0);
```

Prepare the terminal verification command for active code:

```bash
rg -n "unilateral|bilateral" src
```

- [ ] **Step 2: Run the code search and focused tests before cleanup**

Run: `rg -n "unilateral|bilateral" src`
Expected: no matches in active frontend runtime code.

Run: `npm test -- --runInBand src/app/App.test.tsx src/pages/RoutinesPage.test.tsx src/pages/WorkoutPage.test.tsx`
Expected: PASS if the refactor is stable; FAIL only if cleanup introduced regressions that still need fixing.

- [ ] **Step 3: Finalize any remaining cleanup and update the handoff**

If any active frontend files still reference stale concepts or inconsistent copy, remove them. Then update the handoff with the completed state:

```md
## Tests / Verification Status

Completed after the B2 pass:

- `npm test -- --runInBand`
- `npm run build`

## Main Outstanding Work

- optional dark mode implementation
- future decision on official `shadcn/ui` migration after the UI system settles
```

- [ ] **Step 4: Run the full verification suite**

Run: `npm test -- --runInBand`
Expected: PASS

Run: `npm run build`
Expected: PASS with the production bundle generated successfully.

- [ ] **Step 5: Commit the final cleanup and verification pass**

```bash
git add src/types/domain.ts src/state/gainly-store.tsx src/data/mockExercises.ts src/data/mockRoutines.ts docs/superpowers/handoffs/2026-03-28-session-handoff.md src/app/App.test.tsx src/pages/RoutinesPage.test.tsx src/pages/WorkoutPage.test.tsx
git commit -m "chore: finish B2 frontend consistency pass"
```
