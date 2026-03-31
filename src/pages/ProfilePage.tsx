import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useGainlyStore } from "../state/gainly-store";

export default function ProfilePage() {
  const { viewer, routines, exercises, signOut } = useGainlyStore();

  const totalExercises = routines.reduce((total, routine) => total + routine.exercises.length, 0);
  const weeklySets = routines.reduce(
    (total, routine) =>
      total + routine.exercises.reduce((exerciseTotal, item) => exerciseTotal + item.sets.length, 0),
    0,
  );

  return (
    <section className="space-y-6 md:space-y-8">
      <header className="space-y-2">
        <p className="eyebrow">Athlete profile</p>
        <h1 className="screen-title">Profile</h1>
        <p className="max-w-2xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">
          Maintain a clear baseline of your current training footprint and weekly workload capacity.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <p className="eyebrow">Routines</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{routines.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="eyebrow">Exercise library</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{exercises.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <p className="eyebrow">Weekly sets</p>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{weeklySets}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <p className="eyebrow">Readiness note</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-lg font-medium tracking-tight">Total planned exercises: {totalExercises}</p>
          <div className="panel-inset rounded-2xl px-4 py-3 text-sm text-[hsl(var(--muted-foreground))]">
            Keep volume stable for 2-3 weeks before increasing load to preserve technique quality.
          </div>
        </CardContent>
      </Card>

      {viewer ? (
        <Card>
          <CardHeader className="pb-4">
            <p className="eyebrow">Account</p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-lg font-medium tracking-tight">{viewer.name ?? "Gainly athlete"}</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))]">{viewer.email ?? "Signed in"}</p>
            </div>
            <Button variant="outline" onClick={() => void signOut()}>
              Sign out
            </Button>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
