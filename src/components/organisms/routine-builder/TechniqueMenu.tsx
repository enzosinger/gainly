import { useState } from "react";
import { Zap } from "lucide-react";
import type { TechniqueType } from "../../../types/domain";
import { Button } from "../../ui/button";

const menuItems = [
  { id: "backoff", label: "Back-off set" },
  { id: "cluster", label: "Cluster set" },
  { id: "superset", label: "Super set" },
] as const;

export default function TechniqueMenu({
  onSelect,
}: {
  onSelect: (technique: Exclude<TechniqueType, "normal">) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="rounded-full"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        aria-label="Add technique"
      >
        <Zap className="h-4 w-4" />
      </Button>
      {open ? (
        <div
          role="menu"
          className="panel-card absolute left-0 z-10 mt-2 min-w-44 space-y-1 rounded-2xl p-2 sm:right-0 sm:left-auto"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className="block w-full rounded-xl px-3 py-2 text-left text-sm text-[hsl(var(--foreground))] transition-colors hover:bg-[hsl(var(--panel-inset))]"
              onClick={() => {
                onSelect(item.id);
                setOpen(false);
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
