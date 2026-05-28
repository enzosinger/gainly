import { createContext, useContext } from "react";
import type { GainlyStoreValue } from "./gainly-store-types";

export const GainlyStoreContext = createContext<GainlyStoreValue | null>(null);

export function useGainlyStore() {
  const value = useContext(GainlyStoreContext);
  if (!value) {
    throw new Error("useGainlyStore must be used within GainlyStoreProvider");
  }
  return value;
}
