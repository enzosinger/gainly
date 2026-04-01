import { Button } from "../ui/button";
import { cn } from "../../lib/utils";
import { useLanguage } from "../../i18n/LanguageProvider";

type LanguageSwitcherProps = {
  className?: string;
  compact?: boolean;
};

export default function LanguageSwitcher({ className, compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage, copy } = useLanguage();

  return (
    <div
      role="group"
      aria-label={copy.language.label}
      className={cn("inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--panel))] p-1", className)}
    >
      <Button
        type="button"
        variant={language === "en" ? "default" : "ghost"}
        size={compact ? "sm" : "default"}
        className="rounded-full px-3"
        aria-pressed={language === "en"}
        onClick={() => setLanguage("en")}
      >
        {copy.language.english}
      </Button>
      <Button
        type="button"
        variant={language === "pt" ? "default" : "ghost"}
        size={compact ? "sm" : "default"}
        className="rounded-full px-3"
        aria-pressed={language === "pt"}
        onClick={() => setLanguage("pt")}
      >
        {copy.language.portuguese}
      </Button>
    </div>
  );
}
