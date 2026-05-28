import { Card, CardContent } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";
import { useLanguage } from "../../../i18n/LanguageProvider";

export default function RoutinesLoadingState() {
  const { copy } = useLanguage();

  return (
    <section className="space-y-6 md:space-y-8" aria-busy="true">
      <header className="space-y-3">
        <p className="eyebrow">{copy.routines.eyebrow}</p>
        <h1 className="screen-title">{copy.routines.title}</h1>
        <p className="max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">
          {copy.routines.description}
        </p>
      </header>

      <Card role="status" aria-label={copy.app.loading}>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
          <div className="grid gap-4 md:gap-5 xl:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="min-h-[11rem]">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
