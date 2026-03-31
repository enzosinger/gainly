import { RouterProvider } from "react-router-dom";
import type { ComponentProps } from "react";
import { useConvexAuth } from "convex/react";
import LandingPage from "../pages/LandingPage";
import { ConvexGainlyStoreProvider } from "../state/gainly-store";
import { appRouter } from "./router";

type AppProps = {
  router?: ComponentProps<typeof RouterProvider>["router"];
};

function AuthenticatedApp({ router }: Required<AppProps>) {
  return (
    <ConvexGainlyStoreProvider>
      <RouterProvider router={router} />
    </ConvexGainlyStoreProvider>
  );
}

export default function App({ router = appRouter }: AppProps) {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[hsl(var(--background))] px-4 py-6 md:px-10 md:py-10">
        <div className="panel-card mx-auto max-w-2xl px-6 py-8 text-sm text-[hsl(var(--muted-foreground))]">
          Connecting to your training workspace...
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <AuthenticatedApp router={router} />
  );
}
