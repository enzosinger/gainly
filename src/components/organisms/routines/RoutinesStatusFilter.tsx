import { Button } from "../../ui/button";
import { useLanguage } from "../../../i18n/LanguageProvider";

export type RoutineStatusFilterValue = "all" | "active" | "inactive";

type RoutinesStatusFilterProps = {
  filter: RoutineStatusFilterValue;
  activeCount: number;
  inactiveCount: number;
  onFilterChange: (filter: RoutineStatusFilterValue) => void;
};

export default function RoutinesStatusFilter({
  filter,
  activeCount,
  inactiveCount,
  onFilterChange,
}: RoutinesStatusFilterProps) {
  const { copy } = useLanguage();
  const options = [
    { value: "all", label: copy.routines.allFilter, ariaLabel: copy.routines.allFilterAria, count: activeCount + inactiveCount },
    { value: "active", label: copy.routines.activeFilter, ariaLabel: copy.routines.activeFilterAria, count: activeCount },
    {
      value: "inactive",
      label: copy.routines.inactiveFilter,
      ariaLabel: copy.routines.inactiveFilterAria,
      count: inactiveCount,
    },
  ] as const;

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={copy.routines.statusFilterLabel}>
      {options.map((option) => {
        const isSelected = filter === option.value;

        return (
          <Button
            key={option.value}
            type="button"
            variant={isSelected ? "default" : "outline"}
            size="sm"
            className="rounded-full"
            aria-label={option.ariaLabel}
            aria-pressed={isSelected}
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
            <span className="ml-2 text-xs opacity-70">{option.count}</span>
          </Button>
        );
      })}
    </div>
  );
}
