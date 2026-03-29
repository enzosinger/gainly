import { Check, Clock3 } from "lucide-react";
import { cn } from "../../lib/utils";

type StatusGlyphProps = {
  completed: boolean;
};

export default function StatusGlyph({ completed }: StatusGlyphProps) {
  const glyphClasses = cn(
    "inline-flex h-8 w-8 items-center justify-center rounded-full border",
    completed
      ? "border-[hsl(var(--strong))] bg-[hsl(var(--strong))] text-white"
      : "border-[hsl(var(--border))] bg-[hsl(var(--panel-inset))] text-[hsl(var(--muted-foreground))]",
  );

  if (completed) {
    return (
      <span data-testid="status-glyph" className={glyphClasses}>
        <Check data-testid="status-glyph-completed" className="size-4" />
      </span>
    );
  }

  return (
    <span data-testid="status-glyph" className={glyphClasses}>
      <Clock3 data-testid="status-glyph-upcoming" className="size-4" />
    </span>
  );
}
