import PasswordAuthForm from "../components/auth/PasswordAuthForm";
import gainlyLogo from "../../gainly_logo.png";
import gainlyLogoWhite from "../../gainly_logo_white.png";
import LanguageSwitcher from "../components/i18n/LanguageSwitcher";
import { useLanguage } from "../i18n/LanguageProvider";

export default function LandingPage() {
  const { copy } = useLanguage();

  return (
    <main className="min-h-screen bg-[hsl(var(--background))] px-4 py-4 text-[hsl(var(--foreground))] md:px-8 md:py-6">
      <div className="absolute right-4 top-4 z-10 md:right-8 md:top-6">
        <LanguageSwitcher compact />
      </div>
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-3xl flex-col items-center justify-center gap-5 text-center md:min-h-[calc(100vh-3rem)] md:gap-6">
        <section className="w-full panel-card overflow-hidden">
          <div className="relative px-5 py-7 md:px-8 md:py-8">
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-br from-[hsl(var(--panel))] via-[hsl(var(--panel-inset))] to-[hsl(var(--background))]" />
            <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-3">
              <img src={gainlyLogo} alt="Gainly" className="h-[4.75rem] w-auto transition-opacity md:h-[5.5rem] dark:hidden" />
              <img src={gainlyLogoWhite} alt="Gainly" className="hidden h-[4.75rem] w-auto transition-opacity md:h-[5.5rem] dark:block" />

              <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{copy.landing.title}</h1>
              <p className="max-w-xl text-sm text-[hsl(var(--muted-foreground))] md:text-base">
                {copy.landing.description}
              </p>
            </div>
          </div>
        </section>
        <section className="w-full max-w-xl space-y-4">
          <PasswordAuthForm />
        </section>
      </div>
    </main>
  );
}
