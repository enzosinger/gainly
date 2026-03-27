import { createBrowserRouter } from "react-router-dom";
import AppShell from "./layouts/AppShell";
import { DashboardPage, ExercisesPage, ProfilePage, RoutinesPage } from "./pages/placeholders";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "routines", element: <RoutinesPage /> },
      { path: "exercises", element: <ExercisesPage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);
