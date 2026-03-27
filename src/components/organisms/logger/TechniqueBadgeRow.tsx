import type { SetEntry } from "../../../types/domain";

const labels: Record<SetEntry["technique"], string> = {
  normal: "Normal",
  backoff: "Back-off",
  cluster: "Cluster",
  superset: "Superset",
};

export default function TechniqueBadgeRow({ sets }: { sets: SetEntry[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from(new Set(sets.map((set) => set.technique))).map((technique) => (
        <span key={technique} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">
          {labels[technique]}
        </span>
      ))}
    </div>
  );
}
