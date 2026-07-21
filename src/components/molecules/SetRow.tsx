import { useEffect, useRef, useState } from "react";
import type { WorkoutSessionSet } from "../../types/domain";
import { useLanguage } from "../../i18n/LanguageProvider";
import { getTechniqueLabel } from "../../i18n/copy";
import { MovementFields, SetNumberField, TechniqueNote } from "./SetRowFields";

type SetRowProps = {
  set: WorkoutSessionSet;
  index: number;
  previousSet?: WorkoutSessionSet;
  primaryExerciseName: string;
  pairExerciseName?: string;
  onCommit: (input: {
    weightKg: number | null;
    reps: number | null;
    pairWeightKg: number | null;
    pairReps: number | null;
  }) => void;
};

type DraftValues = {
  weightKg: string;
  reps: string;
  pairWeightKg: string;
  pairReps: string;
};

type DraftKey = keyof DraftValues;

function formatPerformance(weightKg?: number, reps?: number) {
  const parts = [];
  if (weightKg) parts.push(`${weightKg} kg`);
  if (reps) parts.push(`${reps} reps`);
  return parts.length > 0 ? parts.join(" · ") : null;
}

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

export default function SetRow({ set, index, previousSet, primaryExerciseName, pairExerciseName, onCommit }: SetRowProps) {
  const { copy, language } = useLanguage();
  const initialDraft = buildDraft(set);
  const [draft, setDraft] = useState<DraftValues>(initialDraft);
  const draftRef = useRef<DraftValues>(initialDraft);
  const setRef = useRef(set);
  const onCommitRef = useRef(onCommit);
  const lastCommittedSignatureRef = useRef<string | null>(null);
  const technique = getTechniqueLabel(language, set.technique);
  const isSuperset = set.technique === "superset" && Boolean(pairExerciseName);
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
    if (signature === lastCommittedSignatureRef.current) {
      return;
    }

    lastCommittedSignatureRef.current = signature;
    onCommitRef.current(payload);
  }

  function previousText(weightKg?: number, reps?: number) {
    const summary = formatPerformance(weightKg, reps);
    return summary ? copy.builder.previousWorkout(summary) : "--";
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

  const previous = previousText(previousSet?.weightKg, previousSet?.reps);
  const showTechnique = set.technique !== "normal";

  return (
    <div className="py-3 text-sm text-[hsl(var(--foreground))]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-baseline gap-2">
          <p className="shrink-0 font-medium text-[hsl(var(--muted-foreground))]">{copy.builder.setIndex(index + 1)}</p>
          {!isSuperset ? (
            <p className="truncate text-xs text-[hsl(var(--muted-foreground))]">{previous}</p>
          ) : null}
        </div>
        {showTechnique ? (
          <p className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">{technique}</p>
        ) : null}
      </div>

      {isSuperset ? (
        <div className="mt-2 space-y-2 sm:mt-3 sm:space-y-3">
          <MovementFields
            name={primaryExerciseName}
            previous={previousText(previousSet?.weightKg, previousSet?.reps)}
            weightValue={draft.weightKg}
            repsValue={draft.reps}
            weightPlaceholder={previousSet?.weightKg ? `${previousSet.weightKg}` : "kg"}
            repsPlaceholder={previousSet?.reps ? `${previousSet.reps}` : "reps"}
            onWeightChange={(value) => updateDraft("weightKg", value)}
            onRepsChange={(value) => updateDraft("reps", value)}
          />
          <MovementFields
            name={pairExerciseName ?? ""}
            previous={previousText(previousSet?.pairWeightKg, previousSet?.pairReps)}
            weightValue={draft.pairWeightKg}
            repsValue={draft.pairReps}
            weightPlaceholder={previousSet?.pairWeightKg ? `${previousSet.pairWeightKg}` : "kg"}
            repsPlaceholder={previousSet?.pairReps ? `${previousSet.pairReps}` : "reps"}
            onWeightChange={(value) => updateDraft("pairWeightKg", value)}
            onRepsChange={(value) => updateDraft("pairReps", value)}
          />
        </div>
      ) : (
        <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-3 sm:grid-cols-2">
          <SetNumberField
            label={copy.builder.weight}
            value={draft.weightKg}
            placeholder={previousSet?.weightKg ? `${previousSet.weightKg}` : "kg"}
            step="0.5"
            inputMode="decimal"
            onChange={(value) => updateDraft("weightKg", value)}
          />
          <SetNumberField
            label={copy.builder.reps}
            value={draft.reps}
            placeholder={previousSet?.reps ? `${previousSet.reps}` : "reps"}
            step="1"
            inputMode="numeric"
            onChange={(value) => updateDraft("reps", value)}
          />
        </div>
      )}
      <TechniqueNote set={set} />
    </div>
  );
}
