import { Check, Circle, Clock3 } from "lucide-react";

type StatusGlyphProps = {
  completed: boolean;
  upcoming?: boolean;
};

export default function StatusGlyph({ completed, upcoming }: StatusGlyphProps) {
  if (completed) {
    return <Check data-testid="status-glyph" className="size-4 text-[hsl(var(--accent))]" />;
  }

  if (upcoming) {
    return <Clock3 data-testid="status-glyph" className="size-4 text-[hsl(var(--warning))]" />;
  }

  return <Circle data-testid="status-glyph" className="size-4 text-white/35" />;
}
