import PasswordAuthForm from "../components/auth/PasswordAuthForm";
import { Github, MoveRight } from "lucide-react";
import { useLanguage } from "../i18n/LanguageProvider";

export default function LandingPage() {
  const { copy } = useLanguage();

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <section className="landing-reveal flex min-h-screen flex-col bg-[hsl(var(--background))] px-6 py-6 sm:px-8 lg:px-10 lg:py-8" style={{ ["--landing-delay" as string]: "0ms" }}>
          <div className="flex items-center lg:hidden">
            <img src="/gainly_logo.png" alt="Gainly" className="h-14 w-auto dark:hidden lg:h-14" />
            <img src="/gainly_logo_white.png" alt="Gainly" className="hidden h-14 w-auto dark:block lg:h-14" />
          </div>

          <div className="flex flex-1 items-start justify-center py-6 lg:items-center lg:py-0">
            <div className="w-full max-w-md space-y-4">
              <div className="landing-reveal space-y-2 text-left lg:text-left" style={{ ["--landing-delay" as string]: "120ms" }}>
                <h1 className="text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
                  {copy.landing.title}
                </h1>
                <p className="text-sm leading-6 text-[hsl(var(--muted-foreground))]">
                  {copy.landing.description}
                </p>
              </div>

              <div className="landing-reveal" style={{ ["--landing-delay" as string]: "220ms" }}>
                <PasswordAuthForm />
              </div>

              <a
                href="https://github.com/enzosinger"
                target="_blank"
                rel="noreferrer"
                className="landing-reveal group flex items-center justify-between rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--panel))] px-4 py-3 text-left transition-colors duration-200 hover:bg-[hsl(var(--panel-inset))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2"
                style={{ ["--landing-delay" as string]: "300ms" }}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-2.5 transition-transform duration-200 group-hover:scale-[1.03]">
                    <Github className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--muted-foreground))]">
                      PROJECT AUTHOR
                    </p>
                    <p className="text-sm text-[hsl(var(--foreground))]">github.com/enzosinger</p>
                  </div>
                </div>
                <MoveRight className="h-4 w-4 shrink-0 text-[hsl(var(--muted-foreground))] transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </section>

        <aside className="landing-slogan-surface relative isolate hidden min-h-screen overflow-hidden border-l border-[hsl(var(--border))] lg:flex lg:items-center lg:justify-center">
          <div className="landing-slogan-overlay absolute inset-0 z-0" />
          <div
            className="landing-reveal relative z-10 flex h-full w-full items-center justify-center p-10 xl:p-14"
            style={{ ["--landing-delay" as string]: "180ms" }}
          >
            <div className="landing-image flex w-full max-w-[68rem] items-center justify-center">
              <img
                src="/gainly_no_bg.png"
                alt="Gainly slogan"
                className="landing-slogan-image max-h-[78vh] w-[102%] max-w-[58rem] -translate-y-[4%] object-contain object-center transform-gpu"
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
