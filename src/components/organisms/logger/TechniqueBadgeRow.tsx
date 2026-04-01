import { Badge } from "../../ui/badge";
import type { TechniqueType } from "../../../types/domain";
import { useLanguage } from "../../../i18n/LanguageProvider";
import { getTechniqueLabel } from "../../../i18n/copy";

export default function TechniqueBadgeRow({ sets }: { sets: Array<{ technique: TechniqueType }> }) {
  const { language } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2">
      {Array.from(new Set(sets.map((set) => set.technique))).map((technique) => (
        <Badge key={technique} variant="secondary" className="capitalize">
          {getTechniqueLabel(language, technique)}
        </Badge>
      ))}
    </div>
  );
}
