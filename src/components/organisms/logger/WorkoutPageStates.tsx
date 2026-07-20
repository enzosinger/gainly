import type { ReactNode } from "react";
import { Card, CardContent } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

type WorkoutLoadingStateProps = {
  weekNavigation: ReactNode;
  title: string;
  description: string;
  loadingLabel: string;
};

export function WorkoutLoadingState({ weekNavigation, title, description, loadingLabel }: WorkoutLoadingStateProps) {
  return (
    <section className="space-y-6 md:space-y-8" aria-busy="true">
      {weekNavigation}
      <header className="space-y-2">
        <h1 className="screen-title">{title}</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
      </header>
      <Card role="status" aria-label={loadingLabel}>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-4 w-72" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
            <Skeleton className="h-36 w-full rounded-2xl" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function WorkoutEmptyState({ title, body }: { title: string; body: string }) {
  return (
    <section className="space-y-4">
      <h1 className="screen-title">{title}</h1>
      <p className="mt-4 text-sm text-[hsl(var(--muted-foreground))]">{body}</p>
    </section>
  );
}

type WorkoutRestoringStateProps = {
  weekNavigation: ReactNode;
  title: string;
  description: string;
  body: string;
  workflowMessage?: string | null;
};

export function WorkoutRestoringState({
  weekNavigation,
  title,
  description,
  body,
  workflowMessage,
}: WorkoutRestoringStateProps) {
  return (
    <section className="space-y-4">
      {weekNavigation}
      <header className="space-y-2">
        <h1 className="screen-title">{title}</h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
      </header>
      {workflowMessage ? (
        <div className="panel-inset border border-[hsl(var(--border))] px-4 py-3 text-sm text-[hsl(var(--foreground))]">
          {workflowMessage}
        </div>
      ) : null}
      <div className="panel-card px-4 py-6 text-sm text-[hsl(var(--muted-foreground))]">{body}</div>
    </section>
  );
}
