import type { SetEntry } from "../../types/domain";

type SetRowProps = {
  set: SetEntry;
  index: number;
  pairExerciseName?: string;
};

function formatWeight(value?: number) {
  return value ? `${value} kg` : "--";
}

function formatReps(set: SetEntry) {
  if (set.reps) return `${set.reps} reps`;
  return "--";
}

export default function SetRow({ set, index, pairExerciseName }: SetRowProps) {
  return (
    <div className="space-y-2 rounded-md border border-zinc-200 bg-zinc-50 p-3 text-sm text-zinc-700">
      <div className="grid grid-cols-[44px_1fr_1fr] gap-2">
        <div className="text-zinc-400">{index + 1}</div>
        <div>{formatWeight(set.weightKg)}</div>
        <div>{formatReps(set)}</div>
      </div>
      {set.technique === "backoff" && set.backoffPercent ? (
        <p className="text-xs text-zinc-500">Back-off: -{set.backoffPercent}%</p>
      ) : null}
      {set.technique === "cluster" && set.clusterBlocks ? (
        <p className="text-xs text-zinc-500">
          Cluster: {set.clusterBlocks} blocks{set.clusterRepRange ? ` (${set.clusterRepRange} reps)` : ""}
        </p>
      ) : null}
      {set.technique === "superset" && pairExerciseName ? (
        <p className="text-xs text-zinc-500">
          Paired with {pairExerciseName}
          {set.pairWeightKg ? ` · ${set.pairWeightKg} kg` : ""}
          {set.pairReps ? ` x ${set.pairReps}` : ""}
        </p>
      ) : null}
    </div>
  );
}
