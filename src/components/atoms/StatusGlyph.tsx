import { Check, Circle, Clock3 } from "lucide-react";

type StatusGlyphProps = {
  completed: boolean;
  upcoming?: boolean;
};

export default function StatusGlyph({ completed, upcoming }: StatusGlyphProps) {
  if (completed) {
    return (
      <span data-testid="status-glyph">
        <Check data-testid="status-glyph-completed" className="size-4 text-[hsl(var(--accent))]" />
      </span>
    );
  }

  if (upcoming) {
    return (
      <span data-testid="status-glyph">
        <Clock3 data-testid="status-glyph-upcoming" className="size-4 text-[hsl(var(--warning))]" />
      </span>
    );
  }

  return (
    <span data-testid="status-glyph">
      <Circle data-testid="status-glyph-pending" className="size-4 text-white/35" />
    </span>
  );
}
