import { Moon, Sun } from "lucide-react";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Switch } from "../components/ui/switch";
import { useTheme } from "../components/ui/theme-provider";
import { useGainlyStore } from "../state/gainly-store";
import { cn } from "../lib/utils";
import { useLanguage } from "../i18n/LanguageProvider";
import LanguageSwitcher from "../components/i18n/LanguageSwitcher";


export default function ProfilePage() {
  const { viewer, routines, exercises, signOut } = useGainlyStore();
  const { theme, setTheme } = useTheme();
  const { copy } = useLanguage();

  const weeklySets = routines.reduce(
    (total, routine) =>
      total + routine.exercises.reduce((exerciseTotal, item) => exerciseTotal + item.sets.length, 0),
    0,
  );

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <p className="eyebrow">{copy.profile.eyebrow}</p>
          <h1 className="screen-title">{copy.profile.title}</h1>
          <p className="max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">{copy.profile.description}</p>
        </div>
        <LanguageSwitcher compact className="self-start" />
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-4">
            <p className="eyebrow">{copy.profile.appearance}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-medium tracking-tight">{copy.profile.darkMode}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {theme === "dark" ? copy.profile.enhancedFocus : copy.profile.maximumVisibility}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Sun className={cn("h-4 w-4 transition-colors", theme === "light" ? "text-[hsl(var(--strong))]" : "text-[hsl(var(--muted-foreground))]")} />
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
                <Moon className={cn("h-4 w-4 transition-colors", theme === "dark" ? "text-[hsl(var(--strong))]" : "text-[hsl(var(--foreground))]")} />
              </div>
            </div>
            <div className="panel-inset flex items-center justify-between rounded-xl px-4 py-3">
              <p className="text-sm font-medium">{copy.profile.followSystemPreference}</p>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-3 text-xs",
                  theme === "system" && "bg-[hsl(var(--panel))] text-[hsl(var(--foreground))] shadow-sm"
                )}
                onClick={() => setTheme("system")}
              >
                {copy.profile.auto}
              </Button>
            </div>
          </CardContent>
        </Card>

        {viewer ? (
          <Card>
            <CardHeader className="pb-4">
              <p className="eyebrow">{copy.profile.account}</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="space-y-1">
                <p className="text-lg font-medium tracking-tight">{viewer.name ?? copy.profile.gainlyAthlete}</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">{viewer.email ?? copy.profile.signedIn}</p>
              </div>
              <Button variant="outline" className="w-full justify-center" onClick={() => void signOut()}>
                {copy.profile.signOut}
              </Button>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <p className="eyebrow">{copy.profile.routines}</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{routines.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="eyebrow">{copy.profile.exerciseLibrary}</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{exercises.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="eyebrow">{copy.profile.weeklySets}</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{weeklySets}</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
