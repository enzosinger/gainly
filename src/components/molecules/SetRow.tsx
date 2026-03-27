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
  if (set.leftReps || set.rightReps) return `L ${set.leftReps ?? "--"} / R ${set.rightReps ?? "--"}`;
  return "--";
}

export default function SetRow({ set, index, pairExerciseName }: SetRowProps) {
  return (
    <div className="space-y-2 rounded-2xl bg-white/[0.04] p-3 text-sm">
      <div className="grid grid-cols-[44px_1fr_1fr] gap-2">
        <div className="text-white/45">{index + 1}</div>
        <div>{formatWeight(set.weightKg)}</div>
        <div>{formatReps(set)}</div>
      </div>
      {set.technique === "backoff" && set.backoffPercent ? (
        <p className="text-xs text-white/55">Back-off: -{set.backoffPercent}%</p>
      ) : null}
      {set.technique === "cluster" && set.clusterBlocks ? (
        <p className="text-xs text-white/55">
          Cluster: {set.clusterBlocks} blocks{set.clusterRepRange ? ` (${set.clusterRepRange} reps)` : ""}
        </p>
      ) : null}
      {set.technique === "superset" && pairExerciseName ? (
        <p className="text-xs text-white/55">
          Paired with {pairExerciseName}
          {set.pairWeightKg ? ` · ${set.pairWeightKg} kg` : ""}
          {set.pairReps ? ` x ${set.pairReps}` : ""}
        </p>
      ) : null}
    </div>
  );
}
