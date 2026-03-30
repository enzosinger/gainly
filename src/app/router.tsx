import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import DashboardPage from "../pages/DashboardPage";
import WorkoutPage from "../pages/WorkoutPage";
import RoutinesPage from "../pages/RoutinesPage";
import RoutineDetailPage from "../pages/RoutineDetailPage";
import ExercisesPage from "../pages/ExercisesPage";
import ProfilePage from "../pages/ProfilePage";

export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "workout/:routineId?", element: <WorkoutPage /> },
      { path: "routines", element: <RoutinesPage /> },
      { path: "routines/:routineId", element: <RoutineDetailPage /> },
      { path: "exercises", element: <ExercisesPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
];

export const appRouter = createBrowserRouter(appRoutes);
