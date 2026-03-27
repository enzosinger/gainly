import { render } from "@testing-library/react";
import type { ReactElement, ReactNode } from "react";
import { GainlyStoreProvider } from "../state/gainly-store";

function Providers({ children }: { children: ReactNode }) {
  return <GainlyStoreProvider>{children}</GainlyStoreProvider>;
}

export function renderWithProviders(ui: ReactElement) {
  return render(ui, { wrapper: Providers });
}
