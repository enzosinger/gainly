import { Check, Pencil, X } from "lucide-react";
import { FormEvent, useEffect, useRef } from "react";
import { useLanguage } from "../../../i18n/LanguageProvider";
import type { Routine } from "../../../types/domain";
import { Button } from "../../ui/button";
import { CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";

type RoutineNameEditorProps = {
  routine: Routine;
  isEditing: boolean;
  draftName: string;
  isSaving: boolean;
  onBeginEdit: (routine: Routine) => void;
  onCancelEdit: () => void;
  onDraftNameChange: (name: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>, routine: Routine) => void;
};

export default function RoutineNameEditor({
  routine,
  isEditing,
  draftName,
  isSaving,
  onBeginEdit,
  onCancelEdit,
  onDraftNameChange,
  onSubmit,
}: RoutineNameEditorProps) {
  const { copy } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  if (isEditing) {
    return (
      <form className="pointer-events-auto flex min-w-0 flex-1 items-center gap-2" onSubmit={(event) => onSubmit(event, routine)}>
        <Input
          ref={inputRef}
          value={draftName}
          aria-label={copy.routines.createLabel}
          className="h-11 min-w-0 text-base font-semibold md:text-lg"
          onChange={(event) => onDraftNameChange(event.target.value)}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full"
          aria-label={copy.routines.cancelRenameRoutineButton(routine.name)}
          onClick={onCancelEdit}
        >
          <X className="size-4" />
        </Button>
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="h-9 w-9 shrink-0 rounded-full"
          aria-label={copy.routines.saveRenameRoutineButton(routine.name)}
          disabled={isSaving || !draftName.trim()}
        >
          <Check className="size-4" />
        </Button>
      </form>
    );
  }

  return (
    <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:min-w-fit sm:flex-nowrap">
      <CardTitle className="break-words text-2xl leading-tight sm:whitespace-nowrap md:text-[2rem]">{routine.name}</CardTitle>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="pointer-events-auto h-9 w-9 shrink-0 rounded-full"
        aria-label={copy.routines.editRoutineNameButton(routine.name)}
        onClick={() => onBeginEdit(routine)}
      >
        <Pencil className="size-4" />
      </Button>
      {routine.isActive === false ? (
        <span className="ml-auto shrink-0 rounded-full border border-[hsl(var(--border))] px-2 py-1 text-xs font-medium text-[hsl(var(--muted-foreground))] sm:ml-0">
          {copy.routines.inactiveLabel}
        </span>
      ) : null}
    </div>
  );
}
