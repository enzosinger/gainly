import type { FormEvent } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Input } from "../../ui/input";
import { useLanguage } from "../../../i18n/LanguageProvider";

type CreateRoutineCardProps = {
  formId: string;
  name: string;
  isSaving: boolean;
  onNameChange: (name: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
};

export default function CreateRoutineCard({
  formId,
  name,
  isSaving,
  onNameChange,
  onSubmit,
  onClose,
}: CreateRoutineCardProps) {
  const { copy } = useLanguage();

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <form id={formId} className="space-y-4" onSubmit={onSubmit}>
          <label className="block text-sm">
            <span className="block text-[hsl(var(--muted-foreground))]">{copy.routines.createLabel}</span>
            <Input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              className="mt-2"
              placeholder={copy.routines.createPlaceholder}
            />
          </label>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={isSaving}>
              {copy.routines.createAction}
            </Button>
            <Button type="button" variant="outline" aria-controls={formId} onClick={onClose}>
              {copy.routines.close}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
