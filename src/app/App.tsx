import { RouterProvider } from "react-router-dom";
import type { ComponentProps } from "react";
import { GainlyStoreProvider } from "../state/gainly-store";
import { appRouter } from "./router";

type AppProps = {
  router?: ComponentProps<typeof RouterProvider>["router"];
};

export default function App({ router = appRouter }: AppProps) {
  return (
    <GainlyStoreProvider>
      <RouterProvider router={router} />
    </GainlyStoreProvider>
  );
}
