import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import type { WorkoutSessionSet } from "../../types/domain";

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

function formatReference(set?: WorkoutSessionSet) {
  if (!set) {
    return "No previous workout yet.";
  }

  const parts = [formatWeight(set.weightKg), formatReps(set)];

  if (set.pairWeightKg || set.pairReps) {
    parts.push(`pair ${formatWeight(set.pairWeightKg)}${set.pairReps ? ` x ${set.pairReps}` : ""}`);
  }

  return `Last workout: ${parts.join(" · ")}`;
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

function toPayload(draft: DraftValues) {
  return {
    weightKg: parseValue(draft.weightKg),
    reps: parseValue(draft.reps),
    pairWeightKg: parseValue(draft.pairWeightKg),
    pairReps: parseValue(draft.pairReps),
  };
}

export default function SetRow({ set, index, previousSet, pairExerciseName, onCommit }: SetRowProps) {
  const [draft, setDraft] = useState<DraftValues>(() => buildDraft(set));

  useEffect(() => {
    setDraft(buildDraft(set));
  }, [set.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const payload = toPayload(draft);
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
  }, [draft, onCommit, set]);

  return (
    <div className="panel-inset space-y-3 p-3 text-sm text-[hsl(var(--foreground))]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-[hsl(var(--muted-foreground))]">Set {index + 1}</div>
        <div className="text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">{set.technique}</div>
      </div>
      <p className="text-xs text-[hsl(var(--muted-foreground))]">{formatReference(previousSet)}</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="block text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Weight</span>
          <Input
            type="number"
            step="0.5"
            min="0"
            inputMode="decimal"
            value={draft.weightKg}
            placeholder={previousSet?.weightKg ? `${previousSet.weightKg}` : "kg"}
            onChange={(event) => {
              const { value } = event.currentTarget;
              setDraft((current) => ({ ...current, weightKg: value }));
            }}
            onBlur={(event) => {
              const nextDraft = { ...draft, weightKg: event.currentTarget.value };
              setDraft(nextDraft);
              onCommit(toPayload(nextDraft));
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
            }}
          />
        </label>
        <label className="space-y-1">
          <span className="block text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">Reps</span>
          <Input
            type="number"
            step="1"
            min="0"
            inputMode="numeric"
            value={draft.reps}
            placeholder={previousSet?.reps ? `${previousSet.reps}` : "reps"}
            onChange={(event) => {
              const { value } = event.currentTarget;
              setDraft((current) => ({ ...current, reps: value }));
            }}
            onBlur={(event) => {
              const nextDraft = { ...draft, reps: event.currentTarget.value };
              setDraft(nextDraft);
              onCommit(toPayload(nextDraft));
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
        <p className="text-xs text-[hsl(var(--muted-foreground))]">Back-off: -{set.backoffPercent}%</p>
      ) : null}
      {set.technique === "cluster" && set.clusterBlocks ? (
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          Cluster: {set.clusterBlocks} blocks{set.clusterRepRange ? ` (${set.clusterRepRange} reps)` : ""}
        </p>
      ) : null}
      {set.technique === "superset" && pairExerciseName ? (
        <div className="space-y-2">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Paired with {pairExerciseName}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="block text-xs uppercase tracking-[0.14em] text-[hsl(var(--muted-foreground))]">
                Pair weight
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
                  setDraft((current) => ({ ...current, pairWeightKg: value }));
                }}
                onBlur={(event) => {
                  const nextDraft = { ...draft, pairWeightKg: event.currentTarget.value };
                  setDraft(nextDraft);
                  onCommit(toPayload(nextDraft));
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
                Pair reps
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
                  setDraft((current) => ({ ...current, pairReps: value }));
                }}
                onBlur={(event) => {
                  const nextDraft = { ...draft, pairReps: event.currentTarget.value };
                  setDraft(nextDraft);
                  onCommit(toPayload(nextDraft));
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
