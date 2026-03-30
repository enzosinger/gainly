import * as React from "react";
import { cn } from "../../lib/utils";

type CollapsibleContextValue = {
  open: boolean;
  contentId: string;
  setOpen: (nextOpen: boolean) => void;
};

const CollapsibleContext = React.createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const context = React.useContext(CollapsibleContext);

  if (!context) {
    throw new Error("Collapsible components must be used within a Collapsible");
  }

  return context;
}

interface CollapsibleProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(
  ({ className, open: controlledOpen, defaultOpen = false, onOpenChange, ...props }, ref) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen);
    const contentId = React.useId();
    const open = controlledOpen ?? uncontrolledOpen;

    const setOpen = React.useCallback(
      (nextOpen: boolean) => {
        if (controlledOpen === undefined) {
          setUncontrolledOpen(nextOpen);
        }
        onOpenChange?.(nextOpen);
      },
      [controlledOpen, onOpenChange],
    );

    return (
      <CollapsibleContext.Provider value={{ open, contentId, setOpen }}>
        <div ref={ref} className={cn(className)} data-state={open ? "open" : "closed"} {...props} />
      </CollapsibleContext.Provider>
    );
  },
);
Collapsible.displayName = "Collapsible";

interface CollapsibleTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  asChild?: boolean;
}

const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ children, asChild = false, onClick, ...props }, ref) => {
    const { open, contentId, setOpen } = useCollapsibleContext();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (!event.defaultPrevented) {
        setOpen(!open);
      }
    };

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
        ...props,
        "aria-controls": contentId,
        "aria-expanded": open,
        "data-state": open ? "open" : "closed",
        onClick: handleClick,
      });
    }

    return (
      <button
        ref={ref}
        type="button"
        aria-controls={contentId}
        aria-expanded={open}
        data-state={open ? "open" : "closed"}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    );
  },
);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

interface CollapsibleContentProps extends React.HTMLAttributes<HTMLDivElement> {
  forceMount?: boolean;
}

const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className, forceMount = false, ...props }, ref) => {
    const { open, contentId } = useCollapsibleContext();

    if (!open && !forceMount) {
      return null;
    }

    return <div ref={ref} id={contentId} className={cn(className)} data-state={open ? "open" : "closed"} {...props} />;
  },
);
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
