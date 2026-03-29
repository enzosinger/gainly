import { useState } from "react";
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
        size="sm"
        className="rounded-full"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        Add technique
      </Button>
      {open ? (
        <div
          role="menu"
          className="panel-card absolute right-0 z-10 mt-2 min-w-44 space-y-1 rounded-2xl p-2"
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
