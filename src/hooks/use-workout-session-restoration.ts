import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

type RestorationInput = {
  routineId: Id<"routines"> | undefined;
  routineUpdatedAt: number | undefined;
  weekStart: number;
  sessionLoaded: boolean;
};

export function useWorkoutSessionRestoration({ routineId, routineUpdatedAt, weekStart, sessionLoaded }: RestorationInput) {
  const ensureSession = useMutation(api.workouts.ensureSessionForRoutineWeek);
  const requestRef = useRef<{ key: string; promise: Promise<unknown> } | null>(null);
  const key = routineId ? `${routineId}-${weekStart}-${routineUpdatedAt}` : null;
  const [failedKey, setFailedKey] = useState<string | null>(null);

  useEffect(() => {
    if (requestRef.current?.key !== key) requestRef.current = null;
    if (!routineId || !key || !sessionLoaded) return;
    if (!requestRef.current) {
      requestRef.current = { key, promise: ensureSession({ routineId, weekStart }) };
    }
    let current = true;
    setFailedKey(null);
    void requestRef.current.promise.catch(() => {
      if (!current) return;
      requestRef.current = null;
      setFailedKey(key);
    });
    return () => { current = false; };
  }, [ensureSession, key, routineId, sessionLoaded, weekStart]);

  return key !== null && failedKey === key;
}
