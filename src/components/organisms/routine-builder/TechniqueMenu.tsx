import { useState } from "react";
import type { TechniqueType } from "../../../types/domain";

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
      <button
        type="button"
        className="rounded-full border border-white/10 px-3 py-2 text-sm"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        Add technique
      </button>
      {open ? (
        <div role="menu" className="mt-2 rounded-2xl border border-white/10 bg-[hsl(var(--panel))] p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              className="block w-full rounded-xl px-3 py-2 text-left text-sm hover:bg-white/5"
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
