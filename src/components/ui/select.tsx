import * as React from "react";
import { cn } from "../../lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.ComponentProps<"select">>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-10 w-full rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-3 py-2 text-sm text-[hsl(var(--foreground))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));

Select.displayName = "Select";

export { Select };
