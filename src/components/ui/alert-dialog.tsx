import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";
import { Button, type ButtonProps } from "./button";

type AlertDialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
};

const AlertDialogContext = React.createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext() {
  const context = React.useContext(AlertDialogContext);

  if (!context) {
    throw new Error("AlertDialog components must be used within AlertDialog");
  }

  return context;
}

type AlertDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

function AlertDialog({ open, onOpenChange, children }: AlertDialogProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <AlertDialogContext.Provider
      value={{
        open,
        setOpen: onOpenChange,
        titleId,
        descriptionId,
      }}
    >
      {children}
    </AlertDialogContext.Provider>
  );
}

type AlertDialogContentProps = React.HTMLAttributes<HTMLDivElement>;

function AlertDialogContent({ className, children, ...props }: AlertDialogContentProps) {
  const { open, setOpen, titleId, descriptionId } = useAlertDialogContext();

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/40"
        onClick={() => setOpen(false)}
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cn(
          "relative z-10 w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))] p-6 shadow-xl",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}

function AlertDialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-2", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end", className)} {...props} />;
}

function AlertDialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  const { titleId } = useAlertDialogContext();

  return <h2 id={titleId} className={cn("text-lg font-semibold text-[hsl(var(--foreground))]", className)} {...props} />;
}

function AlertDialogDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  const { descriptionId } = useAlertDialogContext();

  return (
    <p
      id={descriptionId}
      className={cn("text-sm text-[hsl(var(--muted-foreground))]", className)}
      {...props}
    />
  );
}

type AlertDialogActionProps = ButtonProps;

function AlertDialogAction({ onClick, ...props }: AlertDialogActionProps) {
  const { setOpen } = useAlertDialogContext();

  return (
    <Button
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(false);
        }
      }}
    />
  );
}

type AlertDialogCancelProps = ButtonProps;

function AlertDialogCancel({ onClick, variant = "outline", ...props }: AlertDialogCancelProps) {
  const { setOpen } = useAlertDialogContext();

  return (
    <Button
      variant={variant}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setOpen(false);
        }
      }}
    />
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
};
