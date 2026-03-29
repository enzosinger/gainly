import { Badge } from "../../ui/badge";
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
        <Badge key={technique} variant="secondary" className="capitalize">
          {labels[technique]}
        </Badge>
      ))}
    </div>
  );
}
