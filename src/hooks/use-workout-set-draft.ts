import { useEffect, useRef, useState } from "react";
import type { WorkoutSessionSet, WorkoutSetInput } from "../types/domain";

type DraftValues = {
  weightKg: string;
  reps: string;
  pairWeightKg: string;
  pairReps: string;
};

type DraftKey = keyof DraftValues;

function parseValue(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function buildDraft(set: WorkoutSessionSet): DraftValues {
  return {
    weightKg: set.weightKg?.toString() ?? "",
    reps: set.reps?.toString() ?? "",
    pairWeightKg: set.pairWeightKg?.toString() ?? "",
    pairReps: set.pairReps?.toString() ?? "",
  };
}

function toPayload(draft: DraftValues, currentSet?: WorkoutSessionSet) {
  return {
    weightKg: parseValue(draft.weightKg) ?? currentSet?.weightKg ?? null,
    reps: parseValue(draft.reps) ?? currentSet?.reps ?? null,
    pairWeightKg: parseValue(draft.pairWeightKg) ?? currentSet?.pairWeightKg ?? null,
    pairReps: parseValue(draft.pairReps) ?? currentSet?.pairReps ?? null,
  };
}

function payloadChanged(draft: DraftValues, set: WorkoutSessionSet) {
  const payload = toPayload(draft, set);
  const originalPayload = toPayload(buildDraft(set));

  return (
    payload.weightKg !== originalPayload.weightKg ||
    payload.reps !== originalPayload.reps ||
    payload.pairWeightKg !== originalPayload.pairWeightKg ||
    payload.pairReps !== originalPayload.pairReps
  );
}

function payloadSignature(input: ReturnType<typeof toPayload>) {
  return `${input.weightKg ?? ""}|${input.reps ?? ""}|${input.pairWeightKg ?? ""}|${input.pairReps ?? ""}`;
}

export function useWorkoutSetDraft(set: WorkoutSessionSet, onCommit: (input: WorkoutSetInput) => Promise<void>) {
  const initialDraft = buildDraft(set);
  const [draft, setDraft] = useState<DraftValues>(initialDraft);
  const draftRef = useRef<DraftValues>(initialDraft);
  const setRef = useRef(set);
  const onCommitRef = useRef(onCommit);
  const lastCommitRef = useRef<{ signature: string } | null>(null);
  setRef.current = set;
  onCommitRef.current = onCommit;

  function updateDraft(key: DraftKey, value: string) {
    const nextDraft = { ...draftRef.current, [key]: value };
    draftRef.current = nextDraft;
    setDraft(nextDraft);
  }

  function commitDraftIfChanged() {
    const currentSet = setRef.current;
    const currentDraft = draftRef.current;
    if (!payloadChanged(currentDraft, currentSet)) {
      return;
    }

    const payload = toPayload(currentDraft, currentSet);
    const signature = payloadSignature(payload);
    if (signature === lastCommitRef.current?.signature) {
      return;
    }

    const attempt = { signature };
    lastCommitRef.current = attempt;
    void onCommitRef.current(payload).catch(() => {
      if (lastCommitRef.current === attempt) {
        lastCommitRef.current = null;
      }
    });
  }

  useEffect(() => {
    const nextDraft = buildDraft(set);
    draftRef.current = nextDraft;
    setDraft(nextDraft);
  }, [set.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      commitDraftIfChanged();
    }, 1000);

    return () => clearTimeout(timer);
  }, [draft]);

  useEffect(() => () => {
    commitDraftIfChanged();
  }, []);

  return { draft, updateDraft };
}
