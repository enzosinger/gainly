import { Check, Clock3 } from "lucide-react";

type StatusGlyphProps = {
  completed: boolean;
};

export default function StatusGlyph({ completed }: StatusGlyphProps) {
  if (completed) {
    return (
      <span data-testid="status-glyph">
        <Check data-testid="status-glyph-completed" className="size-4 text-[hsl(var(--accent))]" />
      </span>
    );
  }

  return (
    <span data-testid="status-glyph">
      <Clock3 data-testid="status-glyph-upcoming" className="size-4 text-[hsl(var(--warning))]" />
    </span>
  );
}
