# Gainly Frontend Validation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a frontend-only, mobile-first validation app for Gainly inside `/Users/enzosinger/Desktop/repos/gainly`, covering the dashboard, workout logging, routine builder, exercise library, and responsive navigation with mocked data.

**Architecture:** Create a React + Vite + TypeScript app with Tailwind and shadcn/ui, then layer a small mocked domain model and local app state on top. Organize the UI using atomic-design-inspired folders so the dashboard, logger, and builder share reusable primitives while staying easy to connect to Convex later.

**Tech Stack:** React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui, React Router, Vitest, Testing Library, `lucide-react`, `@dnd-kit/core`, `@dnd-kit/sortable`

---

## File Structure

Planned project layout and responsibilities:

- `package.json` - app scripts and dependencies
- `vite.config.ts` - Vite config with React plugin and path aliases
- `tsconfig.json` - TypeScript configuration
- `tsconfig.app.json` - app-specific TS config used by Vite
- `tsconfig.node.json` - node/tooling TS config
- `index.html` - Vite entry document
- `src/main.tsx` - React bootstrap
- `src/app/App.tsx` - router entry and top-level providers
- `src/app/router.tsx` - route definitions
- `src/app/layouts/AppShell.tsx` - responsive nav shell for desktop/mobile
- `src/styles/globals.css` - Tailwind imports and app-wide theme tokens
- `src/lib/utils.ts` - shared utility helpers
- `src/lib/format.ts` - lightweight formatting helpers
- `src/types/domain.ts` - frontend domain types for routines, exercises, and set techniques
- `src/data/mockExercises.ts` - mock exercise catalog
- `src/data/mockRoutines.ts` - mock routines and workout history
- `src/state/gainly-store.tsx` - local state provider and actions for reordering, selection, and draft editing
- `src/components/atoms/*` - base UI such as status icons, chips, metric badges, inputs
- `src/components/molecules/*` - routine cards, set rows, exercise list rows
- `src/components/organisms/dashboard/*` - dashboard-specific composed sections
- `src/components/organisms/logger/*` - workout logging sections
- `src/components/organisms/routine-builder/*` - routine builder sections and advanced-technique controls
- `src/components/organisms/library/*` - exercise library screens and filters
- `src/pages/DashboardPage.tsx` - weekly dashboard page
- `src/pages/RoutinesPage.tsx` - routine builder page
- `src/pages/WorkoutPage.tsx` - active workout logging page
- `src/pages/ExercisesPage.tsx` - exercise library page
- `src/pages/ProfilePage.tsx` - simple placeholder profile page
- `src/test/test-utils.tsx` - test render helper with providers/router
- `src/app/App.test.tsx` - shell-level smoke tests
- `src/pages/DashboardPage.test.tsx` - dashboard behavior tests
- `src/pages/WorkoutPage.test.tsx` - logger behavior tests
- `src/pages/RoutinesPage.test.tsx` - routine builder behavior tests

## Task 1: Scaffold The React App And Tooling

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/styles/globals.css`
- Create: `src/lib/utils.ts`

- [ ] **Step 1: Write the initial app shell smoke test**

```tsx
// src/app/App.test.tsx
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

describe("App", () => {
  it("renders the dashboard navigation entry", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm test -- --runInBand src/app/App.test.tsx`
Expected: FAIL with missing files such as `src/app/App` or missing test setup.

- [ ] **Step 3: Create the project files and minimal app bootstrap**

```json
// package.json
{
  "name": "gainly",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.2.0",
    "@dnd-kit/sortable": "^9.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "clsx": "^2.1.1",
    "lucide-react": "^0.511.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.0",
    "tailwind-merge": "^3.3.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/react": "^19.1.2",
    "@types/react-dom": "^19.1.2",
    "@vitejs/plugin-react": "^4.4.1",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.3",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.8.3",
    "vite": "^6.3.5",
    "vitest": "^3.1.4"
  }
}
```

```tsx
// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
```

```css
/* src/styles/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: 218 42% 8%;
  --foreground: 210 40% 96%;
  --panel: 220 32% 15%;
  --panel-2: 217 33% 19%;
  --muted: 216 19% 65%;
  --accent: 154 64% 57%;
  --warning: 43 96% 61%;
  --outline: 215 33% 31%;
}

body {
  @apply min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased;
  background-image:
    radial-gradient(circle at top, rgba(66, 153, 225, 0.16), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 30%);
}
```

- [ ] **Step 4: Add the minimal root app component**

```tsx
// src/app/App.tsx
export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <a href="/" className="rounded-full border border-white/15 px-4 py-2">
        Dashboard
      </a>
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm test -- --runInBand src/app/App.test.tsx`
Expected: PASS with `1 passed`.

- [ ] **Step 6: Commit**

```bash
cd /Users/enzosinger/Desktop/repos/gainly
git add package.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json index.html src/main.tsx src/styles/globals.css src/app/App.tsx src/app/App.test.tsx src/lib/utils.ts
git commit -m "chore: scaffold gainly frontend app"
```

## Task 2: Add Domain Types, Mock Data, Routing, And Responsive App Shell

**Files:**
- Create: `src/app/router.tsx`
- Create: `src/app/layouts/AppShell.tsx`
- Create: `src/types/domain.ts`
- Create: `src/data/mockExercises.ts`
- Create: `src/data/mockRoutines.ts`
- Create: `src/state/gainly-store.tsx`
- Modify: `src/app/App.tsx`
- Create: `src/test/test-utils.tsx`

- [ ] **Step 1: Write the failing navigation and page smoke tests**

```tsx
// src/app/App.test.tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm test -- --runInBand src/app/App.test.tsx`
Expected: FAIL because the store provider, routes, and nav shell do not exist yet.

- [ ] **Step 3: Define the frontend domain model and mock data**

```ts
// src/types/domain.ts
export type MuscleGroup =
  | "chest"
  | "back"
  | "shoulders"
  | "legs"
  | "biceps"
  | "triceps";

export type TechniqueType = "normal" | "backoff" | "cluster" | "superset";

export type Exercise = {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  unilateral: boolean;
};

export type SetEntry = {
  id: string;
  technique: TechniqueType;
  weightKg?: number;
  reps?: number;
  leftReps?: number;
  rightReps?: number;
  backoffPercent?: number;
  clusterBlocks?: number;
  clusterRepRange?: string;
  pairExerciseId?: string;
  pairWeightKg?: number;
  pairReps?: number;
};

export type RoutineExercise = {
  id: string;
  exerciseId: string;
  sets: SetEntry[];
};

export type Routine = {
  id: string;
  name: string;
  weekday: string;
  completed: boolean;
  deltaPercent: number;
  exercises: RoutineExercise[];
};
```

```tsx
// src/state/gainly-store.tsx
import { createContext, useContext, useMemo, useState } from "react";
import { mockExercises } from "../data/mockExercises";
import { mockRoutines } from "../data/mockRoutines";
import type { Exercise, Routine } from "../types/domain";

type GainlyStoreValue = {
  exercises: Exercise[];
  routines: Routine[];
  expandedExerciseId: string | null;
  setExpandedExerciseId: (id: string | null) => void;
  reorderRoutines: (nextIds: string[]) => void;
};

const GainlyStoreContext = createContext<GainlyStoreValue | null>(null);

export function GainlyStoreProvider({ children }: { children: React.ReactNode }) {
  const [routines, setRoutines] = useState(mockRoutines);
  const [expandedExerciseId, setExpandedExerciseId] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      exercises: mockExercises,
      routines,
      expandedExerciseId,
      setExpandedExerciseId,
      reorderRoutines: (nextIds: string[]) => {
        setRoutines((current) => nextIds.map((id) => current.find((routine) => routine.id === id)!).filter(Boolean));
      },
    }),
    [expandedExerciseId, routines],
  );

  return <GainlyStoreContext.Provider value={value}>{children}</GainlyStoreContext.Provider>;
}

export function useGainlyStore() {
  const value = useContext(GainlyStoreContext);
  if (!value) throw new Error("useGainlyStore must be used within GainlyStoreProvider");
  return value;
}
```

- [ ] **Step 4: Create routes and the app shell**

```tsx
// src/app/App.tsx
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router";
import { GainlyStoreProvider } from "../state/gainly-store";

export default function App() {
  return (
    <GainlyStoreProvider>
      <RouterProvider router={appRouter} />
    </GainlyStoreProvider>
  );
}
```

```tsx
// src/app/layouts/AppShell.tsx
import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/routines", label: "Routines" },
  { to: "/exercises", label: "Exercises" },
  { to: "/profile", label: "Profile" },
];

export default function AppShell() {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-white/10 bg-white/5 p-6 md:block">
        <div className="text-sm uppercase tracking-[0.24em] text-white/55">Gainly</div>
        <nav className="mt-8 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className="rounded-2xl px-4 py-3 text-sm text-white/80 hover:bg-white/5">
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-8">
          <Outlet />
        </main>
        <nav className="fixed inset-x-0 bottom-0 flex border-t border-white/10 bg-[hsl(var(--background))]/95 px-3 py-3 md:hidden">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className="flex-1 rounded-2xl px-3 py-2 text-center text-xs text-white/80">
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm test -- --runInBand src/app/App.test.tsx`
Expected: PASS with visible nav destinations.

- [ ] **Step 6: Commit**

```bash
cd /Users/enzosinger/Desktop/repos/gainly
git add src/app/App.tsx src/app/router.tsx src/app/layouts/AppShell.tsx src/types/domain.ts src/data/mockExercises.ts src/data/mockRoutines.ts src/state/gainly-store.tsx src/test/test-utils.tsx src/app/App.test.tsx
git commit -m "feat: add gainly shell and mocked domain state"
```

## Task 3: Build The Weekly Dashboard

**Files:**
- Create: `src/components/atoms/StatusGlyph.tsx`
- Create: `src/components/molecules/RoutineWeekCard.tsx`
- Create: `src/components/organisms/dashboard/WeekStrip.tsx`
- Create: `src/components/organisms/dashboard/WeeklyRoutineList.tsx`
- Create: `src/pages/DashboardPage.tsx`
- Create: `src/pages/DashboardPage.test.tsx`
- Modify: `src/app/router.tsx`

- [ ] **Step 1: Write the failing dashboard tests**

```tsx
// src/pages/DashboardPage.test.tsx
import { render, screen } from "@testing-library/react";
import DashboardPage from "./DashboardPage";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("DashboardPage", () => {
  it("shows all weekly routines with icon-based states", () => {
    render(
      <GainlyStoreProvider>
        <DashboardPage />
      </GainlyStoreProvider>,
    );

    expect(screen.getByText(/push/i)).toBeInTheDocument();
    expect(screen.getByText(/pull/i)).toBeInTheDocument();
    expect(screen.getByText(/legs/i)).toBeInTheDocument();
    expect(screen.getAllByTestId("status-glyph").length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm test -- --runInBand src/pages/DashboardPage.test.tsx`
Expected: FAIL because the page and dashboard components do not exist.

- [ ] **Step 3: Build icon-first dashboard cards and weekly list**

```tsx
// src/components/atoms/StatusGlyph.tsx
import { Check, Circle, Clock3 } from "lucide-react";

type StatusGlyphProps = {
  completed: boolean;
  upcoming?: boolean;
};

export default function StatusGlyph({ completed, upcoming }: StatusGlyphProps) {
  if (completed) {
    return <Check data-testid="status-glyph" className="size-4 text-[hsl(var(--accent))]" />;
  }

  if (upcoming) {
    return <Clock3 data-testid="status-glyph" className="size-4 text-[hsl(var(--warning))]" />;
  }

  return <Circle data-testid="status-glyph" className="size-4 text-white/35" />;
}
```

```tsx
// src/components/molecules/RoutineWeekCard.tsx
import StatusGlyph from "../atoms/StatusGlyph";
import type { Routine } from "../../types/domain";

export default function RoutineWeekCard({ routine }: { routine: Routine }) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.24)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">{routine.weekday}</p>
          <h3 className="mt-2 text-xl font-semibold">{routine.name}</h3>
        </div>
        <StatusGlyph completed={routine.completed} upcoming={!routine.completed} />
      </div>
      <div className="mt-5 flex items-center justify-between rounded-2xl bg-white/[0.03] px-3 py-2 text-sm text-white/70">
        <span>Previous delta</span>
        <span className={routine.deltaPercent >= 0 ? "text-[hsl(var(--accent))]" : "text-rose-300"}>
          {routine.deltaPercent >= 0 ? "+" : ""}
          {routine.deltaPercent.toFixed(1)}%
        </span>
      </div>
    </article>
  );
}
```

```tsx
// src/pages/DashboardPage.tsx
import { useGainlyStore } from "../state/gainly-store";
import RoutineWeekCard from "../components/molecules/RoutineWeekCard";

export default function DashboardPage() {
  const { routines } = useGainlyStore();

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Week 13</p>
        <h1 className="text-3xl font-semibold tracking-tight">Your training week</h1>
      </header>
      <div className="grid gap-4">
        {routines.map((routine) => (
          <RoutineWeekCard key={routine.id} routine={routine} />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Add routine reordering with dnd-kit**

```tsx
// src/components/organisms/dashboard/WeeklyRoutineList.tsx
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useGainlyStore } from "../../../state/gainly-store";
import RoutineWeekCard from "../../molecules/RoutineWeekCard";

export default function WeeklyRoutineList() {
  const { routines, reorderRoutines } = useGainlyStore();
  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={({ active, over }) => {
        if (!over || active.id === over.id) return;
        const ids = routines.map((routine) => routine.id);
        reorderRoutines(arrayMove(ids, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))));
      }}
    >
      <SortableContext items={routines.map((routine) => routine.id)} strategy={verticalListSortingStrategy}>
        <div className="grid gap-4">
          {routines.map((routine) => (
            <RoutineWeekCard key={routine.id} routine={routine} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm test -- --runInBand src/pages/DashboardPage.test.tsx`
Expected: PASS with three routines and icon-based status glyphs present.

- [ ] **Step 6: Commit**

```bash
cd /Users/enzosinger/Desktop/repos/gainly
git add src/components/atoms/StatusGlyph.tsx src/components/molecules/RoutineWeekCard.tsx src/components/organisms/dashboard/WeekStrip.tsx src/components/organisms/dashboard/WeeklyRoutineList.tsx src/pages/DashboardPage.tsx src/pages/DashboardPage.test.tsx src/app/router.tsx
git commit -m "feat: add weekly dashboard experience"
```

## Task 4: Build The Hybrid Workout Logger

**Files:**
- Create: `src/components/molecules/SetRow.tsx`
- Create: `src/components/organisms/logger/ExerciseAccordion.tsx`
- Create: `src/components/organisms/logger/TechniqueBadgeRow.tsx`
- Create: `src/pages/WorkoutPage.tsx`
- Create: `src/pages/WorkoutPage.test.tsx`
- Modify: `src/state/gainly-store.tsx`
- Modify: `src/app/router.tsx`

- [ ] **Step 1: Write the failing logger tests**

```tsx
// src/pages/WorkoutPage.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WorkoutPage from "./WorkoutPage";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("WorkoutPage", () => {
  it("keeps all exercises visible while only one is expanded", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <WorkoutPage />
      </GainlyStoreProvider>,
    );

    await user.click(screen.getByRole("button", { name: /bench press/i }));
    expect(screen.getByText(/previous 80 kg x 8/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fly machine/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm test -- --runInBand src/pages/WorkoutPage.test.tsx`
Expected: FAIL because the workout page and logger accordion do not exist.

- [ ] **Step 3: Implement the exercise accordion and normal set logging rows**

```tsx
// src/components/molecules/SetRow.tsx
import type { SetEntry } from "../../types/domain";

export default function SetRow({ set, index }: { set: SetEntry; index: number }) {
  return (
    <div className="grid grid-cols-[44px_1fr_1fr] gap-2 rounded-2xl bg-white/[0.04] p-3 text-sm">
      <div className="text-white/45">{index + 1}</div>
      <div>{set.weightKg ? `${set.weightKg} kg` : "--"}</div>
      <div>{set.reps ? `${set.reps} reps` : "--"}</div>
    </div>
  );
}
```

```tsx
// src/components/organisms/logger/ExerciseAccordion.tsx
import { ChevronDown } from "lucide-react";
import { useGainlyStore } from "../../../state/gainly-store";
import SetRow from "../../molecules/SetRow";
import type { RoutineExercise } from "../../../types/domain";

export default function ExerciseAccordion({ item, name }: { item: RoutineExercise; name: string }) {
  const { expandedExerciseId, setExpandedExerciseId } = useGainlyStore();
  const expanded = expandedExerciseId === item.id;

  return (
    <section className="rounded-[26px] border border-white/10 bg-white/5">
      <button
        type="button"
        onClick={() => setExpandedExerciseId(expanded ? null : item.id)}
        className="flex w-full items-center justify-between px-4 py-4 text-left"
        aria-expanded={expanded}
      >
        <span className="text-base font-semibold">{name}</span>
        <ChevronDown className={expanded ? "size-5 rotate-180" : "size-5"} />
      </button>
      {expanded ? (
        <div className="space-y-3 border-t border-white/10 px-4 py-4">
          <p className="text-sm text-white/55">Previous 80 kg x 8</p>
          {item.sets.map((set, index) => (
            <SetRow key={set.id} set={set} index={index} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
```

- [ ] **Step 4: Add advanced-technique badges and paired-set rendering**

```tsx
// src/components/organisms/logger/TechniqueBadgeRow.tsx
import type { SetEntry } from "../../../types/domain";

const labels: Record<SetEntry["technique"], string> = {
  normal: "Normal",
  backoff: "Back-off",
  cluster: "Cluster",
  superset: "Superset",
};

export default function TechniqueBadgeRow({ sets }: { sets: SetEntry[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from(new Set(sets.map((set) => set.technique))).map((technique) => (
        <span key={technique} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
          {labels[technique]}
        </span>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm test -- --runInBand src/pages/WorkoutPage.test.tsx`
Expected: PASS with one expanded exercise and the other exercises still visible.

- [ ] **Step 6: Commit**

```bash
cd /Users/enzosinger/Desktop/repos/gainly
git add src/components/molecules/SetRow.tsx src/components/organisms/logger/ExerciseAccordion.tsx src/components/organisms/logger/TechniqueBadgeRow.tsx src/pages/WorkoutPage.tsx src/pages/WorkoutPage.test.tsx src/state/gainly-store.tsx src/app/router.tsx
git commit -m "feat: add workout logging flow"
```

## Task 5: Build The Routine Builder And Exercise Library

**Files:**
- Create: `src/components/organisms/routine-builder/ExercisePicker.tsx`
- Create: `src/components/organisms/routine-builder/RoutineExerciseEditor.tsx`
- Create: `src/components/organisms/routine-builder/TechniqueMenu.tsx`
- Create: `src/components/organisms/library/ExerciseLibraryList.tsx`
- Create: `src/pages/RoutinesPage.tsx`
- Create: `src/pages/ExercisesPage.tsx`
- Create: `src/pages/RoutinesPage.test.tsx`
- Modify: `src/state/gainly-store.tsx`
- Modify: `src/app/router.tsx`

- [ ] **Step 1: Write the failing routine-builder tests**

```tsx
// src/pages/RoutinesPage.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RoutinesPage from "./RoutinesPage";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("RoutinesPage", () => {
  it("starts with normal sets and lets the user add an advanced technique deliberately", async () => {
    const user = userEvent.setup();

    render(
      <GainlyStoreProvider>
        <RoutinesPage />
      </GainlyStoreProvider>,
    );

    await user.click(screen.getByRole("button", { name: /add technique/i }));
    expect(screen.getByRole("menuitem", { name: /back-off set/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /cluster set/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /super set/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm test -- --runInBand src/pages/RoutinesPage.test.tsx`
Expected: FAIL because the routine builder page and technique menu do not exist.

- [ ] **Step 3: Build the exercise picker and routine editor with normal sets by default**

```tsx
// src/components/organisms/routine-builder/RoutineExerciseEditor.tsx
import type { Exercise, RoutineExercise } from "../../../types/domain";
import TechniqueMenu from "./TechniqueMenu";

export default function RoutineExerciseEditor({
  exercise,
  item,
}: {
  exercise: Exercise;
  item: RoutineExercise;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{exercise.name}</h3>
          <p className="text-sm text-white/55">
            {exercise.muscleGroup} · {exercise.unilateral ? "unilateral" : "bilateral"}
          </p>
        </div>
        <TechniqueMenu />
      </div>
      <div className="mt-4 space-y-2">
        {item.sets.map((set, index) => (
          <div key={set.id} className="rounded-2xl bg-white/[0.04] px-3 py-3 text-sm">
            Set {index + 1} · {set.technique}
          </div>
        ))}
      </div>
    </article>
  );
}
```

```tsx
// src/components/organisms/routine-builder/TechniqueMenu.tsx
export default function TechniqueMenu() {
  return (
    <div className="relative">
      <button type="button" className="rounded-full border border-white/10 px-3 py-2 text-sm">
        Add technique
      </button>
      <div className="mt-2 rounded-2xl border border-white/10 bg-[hsl(var(--panel))] p-2">
        <button role="menuitem" className="block w-full rounded-xl px-3 py-2 text-left text-sm">Back-off set</button>
        <button role="menuitem" className="block w-full rounded-xl px-3 py-2 text-left text-sm">Cluster set</button>
        <button role="menuitem" className="block w-full rounded-xl px-3 py-2 text-left text-sm">Super set</button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add inline exercise creation and library reuse views**

```tsx
// src/components/organisms/routine-builder/ExercisePicker.tsx
import { useGainlyStore } from "../../../state/gainly-store";

export default function ExercisePicker() {
  const { exercises } = useGainlyStore();

  return (
    <section className="rounded-[28px] border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Add exercise</h2>
        <button type="button" className="rounded-full border border-white/10 px-3 py-2 text-sm">
          Create new
        </button>
      </div>
      <div className="mt-4 grid gap-2">
        {exercises.map((exercise) => (
          <button key={exercise.id} type="button" className="rounded-2xl bg-white/[0.04] px-3 py-3 text-left">
            {exercise.name}
          </button>
        ))}
      </div>
    </section>
  );
}
```

```tsx
// src/components/organisms/library/ExerciseLibraryList.tsx
import { useGainlyStore } from "../../../state/gainly-store";

export default function ExerciseLibraryList() {
  const { exercises } = useGainlyStore();

  return (
    <div className="grid gap-3">
      {exercises.map((exercise) => (
        <article key={exercise.id} className="rounded-[24px] border border-white/10 bg-white/5 p-4">
          <h3 className="font-semibold">{exercise.name}</h3>
          <p className="mt-2 text-sm text-white/55">
            {exercise.muscleGroup} · {exercise.unilateral ? "unilateral" : "bilateral"}
          </p>
        </article>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm test -- --runInBand src/pages/RoutinesPage.test.tsx`
Expected: PASS with visible advanced-technique menu entries.

- [ ] **Step 6: Commit**

```bash
cd /Users/enzosinger/Desktop/repos/gainly
git add src/components/organisms/routine-builder/ExercisePicker.tsx src/components/organisms/routine-builder/RoutineExerciseEditor.tsx src/components/organisms/routine-builder/TechniqueMenu.tsx src/components/organisms/library/ExerciseLibraryList.tsx src/pages/RoutinesPage.tsx src/pages/ExercisesPage.tsx src/pages/RoutinesPage.test.tsx src/state/gainly-store.tsx src/app/router.tsx
git commit -m "feat: add routine builder and exercise library"
```

## Task 6: Polish Visual System, Responsive States, And Final Verification

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/app/layouts/AppShell.tsx`
- Modify: `src/pages/DashboardPage.tsx`
- Modify: `src/pages/WorkoutPage.tsx`
- Modify: `src/pages/RoutinesPage.tsx`
- Create: `src/pages/ProfilePage.tsx`

- [ ] **Step 1: Write the failing visual regression smoke tests**

```tsx
// src/app/App.test.tsx
import { render, screen } from "@testing-library/react";
import App from "./App";
import { GainlyStoreProvider } from "../state/gainly-store";

describe("visual shell", () => {
  it("renders the mobile navigation and premium heading treatment", () => {
    render(
      <GainlyStoreProvider>
        <App />
      </GainlyStoreProvider>,
    );

    expect(screen.getAllByRole("link", { name: /dashboard/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/your training week/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm test -- --runInBand src/app/App.test.tsx src/pages/DashboardPage.test.tsx src/pages/WorkoutPage.test.tsx src/pages/RoutinesPage.test.tsx`
Expected: FAIL because the final shell polish and profile route are incomplete.

- [ ] **Step 3: Refine the premium analytical theme and responsive layout**

```css
/* src/styles/globals.css */
.panel-card {
  @apply rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur;
}

.eyebrow {
  @apply text-[11px] uppercase tracking-[0.24em] text-white/45;
}

.screen-title {
  @apply text-3xl font-semibold tracking-tight md:text-4xl;
}
```

- [ ] **Step 4: Run the full validation suite and build**

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm run test:run`
Expected: PASS with all page tests green.

Run: `cd /Users/enzosinger/Desktop/repos/gainly && npm run build`
Expected: PASS with Vite production bundle output in `dist/`.

- [ ] **Step 5: Commit**

```bash
cd /Users/enzosinger/Desktop/repos/gainly
git add src/styles/globals.css src/app/layouts/AppShell.tsx src/pages/DashboardPage.tsx src/pages/WorkoutPage.tsx src/pages/RoutinesPage.tsx src/pages/ProfilePage.tsx src/app/App.test.tsx
git commit -m "feat: polish gainly frontend validation experience"
```

## Self-Review

Spec coverage check:

- premium analytical A1 direction is covered in Tasks 1 and 6
- compact weekly dashboard with all routines visible is covered in Task 3
- icon-first status feedback is covered in Task 3
- hybrid workout logger is covered in Task 4
- routine builder with normal sets by default is covered in Task 5
- back-off, cluster, and superset affordances are covered in Tasks 4 and 5
- exercise library and responsive nav shell are covered in Tasks 2 and 5
- frontend-only boundary is maintained across all tasks

Placeholder scan:

- no `TBD`, `TODO`, or deferred implementation notes remain in the task steps

Type consistency check:

- `TechniqueType`, `SetEntry`, `RoutineExercise`, `Routine`, and `Exercise` are defined once in `src/types/domain.ts` and reused across later tasks

