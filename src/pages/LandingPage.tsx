import PasswordAuthForm from "../components/auth/PasswordAuthForm";
import { useLanguage } from "../i18n/LanguageProvider";
import { Github, MoveRight } from "lucide-react";

export default function LandingPage() {
  const { copy } = useLanguage();

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] px-4 py-4 text-[hsl(var(--foreground))] md:px-8 md:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-3xl flex-col items-center justify-center gap-5 text-center md:min-h-[calc(100vh-3rem)] md:gap-6">
        <section className="w-full panel-card overflow-hidden">
          <div className="relative px-5 py-7 md:px-8 md:py-8">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-[hsl(var(--panel))] via-[hsl(var(--panel-inset))] to-[hsl(var(--background))]" />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-3">
              <img src="/gainly_logo.png" alt="Gainly" className="h-[4.75rem] w-auto transition-opacity md:h-[5.5rem] dark:hidden" />
              <img src="/gainly_logo_white.png" alt="Gainly" className="hidden h-[4.75rem] w-auto transition-opacity md:h-[5.5rem] dark:block" />

              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{copy.landing.title}</h1>
              <p className="max-w-xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">
                {copy.landing.description}
              </p>
            </div>
          </div>
        </section>
        <section className="w-full max-w-xl space-y-4">
          <PasswordAuthForm />
          <a
            href="https://github.com/enzosinger"
            target="_blank"
            rel="noreferrer"
            className="group block rounded-[1.5rem] border border-[hsl(var(--border))] bg-[linear-gradient(135deg,hsl(var(--panel))_0%,hsl(var(--background))_100%)] px-4 py-4 text-left transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-2.5">
                  <Github className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--muted-foreground))]">
                    PROJECT AUTHOR
                  </p>
                  <p className="text-sm text-[hsl(var(--foreground))]">github.com/enzosinger</p>
                </div>
              </div>
              <MoveRight className="h-4 w-4 text-[hsl(var(--muted-foreground))] transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </a>
        </section>
      </div>
    </main>
  );
}
