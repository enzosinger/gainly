import type { WorkoutSessionSet } from "../../types/domain";
import { useLanguage } from "../../i18n/LanguageProvider";
import { Input } from "../ui/input";

type SetNumberFieldProps = {
  label: string;
  value: string;
  placeholder: string;
  step: string;
  inputMode: "decimal" | "numeric";
  onChange: (value: string) => void;
};

export function SetNumberField({ label, value, placeholder, step, inputMode, onChange }: SetNumberFieldProps) {
  return (
    <label className="min-w-0 space-y-0 sm:space-y-1">
      <span className="sr-only sm:not-sr-only sm:block sm:text-[0.65rem] sm:uppercase sm:tracking-[0.14em] sm:text-[hsl(var(--muted-foreground))]">
        {label}
      </span>
      <Input
        type="number"
        step={step}
        min="0"
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        className="h-8 px-2 text-sm sm:h-9"
        onChange={(event) => onChange(event.currentTarget.value)}
        onBlur={(event) => onChange(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
      />
    </label>
  );
}

export function TechniqueNote({ set }: { set: WorkoutSessionSet }) {
  const { copy } = useLanguage();
  if (set.technique === "backoff" && set.backoffPercent) {
    return <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">{copy.builder.backoff(set.backoffPercent)}</p>;
  }
  if (set.technique === "cluster" && set.clusterBlocks) {
    return (
      <p className="mt-2 text-xs text-[hsl(var(--muted-foreground))]">
        {copy.builder.cluster(set.clusterBlocks, set.clusterRepRange)}
      </p>
    );
  }
  return null;
}

type MovementFieldsProps = {
  name: string;
  previous: string;
  weightValue: string;
  repsValue: string;
  weightPlaceholder: string;
  repsPlaceholder: string;
  onWeightChange: (value: string) => void;
  onRepsChange: (value: string) => void;
};

export function MovementFields({
  name,
  previous,
  weightValue,
  repsValue,
  weightPlaceholder,
  repsPlaceholder,
  onWeightChange,
  onRepsChange,
}: MovementFieldsProps) {
  const { copy } = useLanguage();
  return (
    <div className="grid grid-cols-2 gap-2 border-t border-[hsl(var(--border))] pt-2 first:border-t-0 first:pt-0 sm:grid-cols-[minmax(0,1fr)_8rem_8rem] sm:items-end sm:pt-3">
      <div className="col-span-2 flex min-w-0 items-baseline justify-between gap-2 sm:col-span-1 sm:block sm:pb-2">
        <p className="truncate font-medium">{name}</p>
        <p className="shrink-0 text-xs text-[hsl(var(--muted-foreground))] sm:mt-1">{previous}</p>
      </div>
      <SetNumberField
        label={copy.builder.weight}
        value={weightValue}
        placeholder={weightPlaceholder}
        step="0.5"
        inputMode="decimal"
        onChange={onWeightChange}
      />
      <SetNumberField
        label={copy.builder.reps}
        value={repsValue}
        placeholder={repsPlaceholder}
        step="1"
        inputMode="numeric"
        onChange={onRepsChange}
      />
    </div>
  );
}
