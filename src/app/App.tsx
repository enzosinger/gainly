import { RouterProvider } from "react-router-dom";
import { GainlyStoreProvider } from "../state/gainly-store";
import { appRouter } from "./router";

export default function App() {
  return (
    <GainlyStoreProvider>
      <RouterProvider router={appRouter} />
    </GainlyStoreProvider>
  );
}
