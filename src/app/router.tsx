import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import DashboardPage from "../pages/DashboardPage";
import WorkoutPage from "../pages/WorkoutPage";
import RoutinesPage from "../pages/RoutinesPage";
import ExercisesPage from "../pages/ExercisesPage";
import { ProfilePage } from "./pages/placeholders";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "workout/:routineId?", element: <WorkoutPage /> },
      { path: "routines", element: <RoutinesPage /> },
      { path: "exercises", element: <ExercisesPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
];

export const appRouter = createBrowserRouter(appRoutes);
