import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import type { WorkoutSessionSet } from "../../types/domain";
import { useLanguage } from "../../i18n/LanguageProvider";
import { getTechniqueLabel } from "../../i18n/copy";

type SetRowProps = {
  set: WorkoutSessionSet;
  index: number;
  previousSet?: WorkoutSessionSet;
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

function formatWeight(value?: number) {
  return value ? `${value} kg` : "--";
}

function formatReps(set: { reps?: number }) {
  if (set.reps) return `${set.reps} reps`;
  return "--";
}

function formatReference(
  set: WorkoutSessionSet | undefined,
  copy?: { builder: { noPreviousWorkout: string; lastWorkout: (summary: string) => string } },
) {
  if (!set) {
    return copy?.builder.noPreviousWorkout ?? "No previous workout yet.";
  }

  const parts = [formatWeight(set.weightKg), formatReps(set)];

  if (set.pairWeightKg || set.pairReps) {
    parts.push(`pair ${formatWeight(set.pairWeightKg)}${set.pairReps ? ` x ${set.pairReps}` : ""}`);
  }

  const summary = parts.join(" · ");
  return copy?.builder.lastWorkout(summary) ?? `Last workout: ${summary}`;
}

function parseValue(value: string) {
  if (!value.trim()) {
    return null;
  }

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

export default function SetRow({ set, index, previousSet, pairExerciseName, onCommit }: SetRowProps) {
  const { copy, language } = useLanguage();
  const initialDraft = buildDraft(set);
  const [draft, setDraft] = useState<DraftValues>(initialDraft);
  const draftRef = useRef<DraftValues>(initialDraft);

  function applyDraftPatch(patch: Partial<DraftValues>) {
    const nextDraft = { ...draftRef.current, ...patch };
    draftRef.current = nextDraft;
    setDraft(nextDraft);
  }

  useEffect(() => {
    const nextDraft = buildDraft(set);
    draftRef.current = nextDraft;
    setDraft(nextDraft);
  }, [set.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const payload = toPayload(draft, set);
      const originalPayload = toPayload(buildDraft(set));

      // Only commit if the values have actually changed from the current set data
      if (
        payload.weightKg !== originalPayload.weightKg ||
        payload.reps !== originalPayload.reps ||
        payload.pairWeightKg !== originalPayload.pairWeightKg ||
        payload.pairReps !== originalPayload.pairReps
      ) {
        onCommit(payload);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [draft, onCommit, set, previousSet]);

  return (
    <div className="panel-inset space-y-3 p-3 text-sm text-[hsl(var(--foreground))]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[hsl(var(--muted-foreground))]">{copy.builder.setIndex(index + 1)}</div>
        <div className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
          {getTechniqueLabel(language, set.technique)}
        </div>
      </div>
      <p className="text-xs text-[hsl(var(--muted-foreground))]">{formatReference(previousSet, copy)}</p>
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="block text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">{copy.builder.weight}</span>
          <Input
            type="number"
            step="0.5"
            min="0"
            inputMode="decimal"
            value={draft.weightKg}
            placeholder={previousSet?.weightKg ? `${previousSet.weightKg}` : "kg"}
            onChange={(event) => {
              const { value } = event.currentTarget;
              applyDraftPatch({ weightKg: value });
            }}
            onBlur={(event) => {
              applyDraftPatch({ weightKg: event.currentTarget.value });
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
        </label>
        <label className="space-y-1">
          <span className="block text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">{copy.builder.reps}</span>
          <Input
            type="number"
            step="1"
            min="0"
            inputMode="numeric"
            value={draft.reps}
            placeholder={previousSet?.reps ? `${previousSet.reps}` : "reps"}
            onChange={(event) => {
              const { value } = event.currentTarget;
              applyDraftPatch({ reps: value });
            }}
            onBlur={(event) => {
              applyDraftPatch({ reps: event.currentTarget.value });
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
        </label>
      </div>
      {set.technique === "backoff" && set.backoffPercent ? (
        <p className="text-xs text-[hsl(var(--muted-foreground))]">{copy.builder.backoff(set.backoffPercent)}</p>
      ) : null}
      {set.technique === "cluster" && set.clusterBlocks ? (
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          {copy.builder.cluster(set.clusterBlocks, set.clusterRepRange)}
        </p>
      ) : null}
      {set.technique === "superset" && pairExerciseName ? (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="block text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
                {copy.builder.pairWeight}
              </span>
              <Input
                type="number"
                step="0.5"
                min="0"
                inputMode="decimal"
                value={draft.pairWeightKg}
                placeholder={previousSet?.pairWeightKg ? `${previousSet.pairWeightKg}` : "kg"}
                onChange={(event) => {
                  const { value } = event.currentTarget;
                  applyDraftPatch({ pairWeightKg: value });
                }}
                onBlur={(event) => {
                  applyDraftPatch({ pairWeightKg: event.currentTarget.value });
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
              />
            </label>
            <label className="space-y-1">
              <span className="block text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
                {copy.builder.pairReps}
              </span>
              <Input
                type="number"
                step="1"
                min="0"
                inputMode="numeric"
                value={draft.pairReps}
                placeholder={previousSet?.pairReps ? `${previousSet.pairReps}` : "reps"}
                onChange={(event) => {
                  const { value } = event.currentTarget;
                  applyDraftPatch({ pairReps: value });
                }}
                onBlur={(event) => {
                  applyDraftPatch({ pairReps: event.currentTarget.value });
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.currentTarget.blur();
                  }
                }}
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
