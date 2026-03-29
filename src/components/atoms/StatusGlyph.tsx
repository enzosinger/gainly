import { Check, Clock3 } from "lucide-react";

type StatusGlyphProps = {
  completed: boolean;
};

export default function StatusGlyph({ completed }: StatusGlyphProps) {
  if (completed) {
    return (
      <span
        data-testid="status-glyph"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-900 bg-zinc-900 text-white"
      >
        <Check data-testid="status-glyph-completed" className="size-4" />
      </span>
    );
  }

  return (
    <span
      data-testid="status-glyph"
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 bg-zinc-50 text-zinc-500"
    >
      <Clock3 data-testid="status-glyph-upcoming" className="size-4" />
    </span>
  );
}
