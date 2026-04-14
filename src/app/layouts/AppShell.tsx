import { Dumbbell, LayoutGrid, ListChecks, User } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "../../lib/utils";
import { useLanguage } from "../../i18n/LanguageProvider";

const desktopNavLinkClasses =
  "rounded-md px-4 py-3 text-sm font-medium transition";
const mobileNavLinkClasses =
  "flex items-center justify-center rounded-md px-1 py-3 text-center transition";
const activeNavLinkClasses = "bg-[hsl(var(--strong))] text-[hsl(var(--strong-foreground))]";
const inactiveDesktopNavLinkClasses =
  "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--panel-inset))] hover:text-[hsl(var(--foreground))]";
const inactiveMobileNavLinkClasses = "text-[hsl(var(--muted-foreground))]";

export default function AppShell() {
  const { copy } = useLanguage();
  const links = [
    { to: "/", label: copy.shell.nav.dashboard, icon: LayoutGrid },
    { to: "/routines", label: copy.shell.nav.routines, icon: ListChecks },
    { to: "/exercises", label: copy.shell.nav.exercises, icon: Dumbbell },
    { to: "/profile", label: copy.shell.nav.profile, icon: User },
  ];

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] md:grid md:grid-cols-[280px_1fr]">
      <aside className="app-shell-sidebar hidden md:flex md:flex-col">
        <div className="flex h-full flex-col px-6 py-8">
          <div className="space-y-3">
            <img src="/gainly_logo.png" alt="Gainly" className="h-[4.5rem] w-auto dark:hidden" />
            <img src="/gainly_logo_white.png" alt="Gainly" className="hidden h-[4.5rem] w-auto dark:block" />
          </div>

          <nav aria-label={copy.shell.navigationLabel} className="mt-10 flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    desktopNavLinkClasses,
                    isActive ? activeNavLinkClasses : inactiveDesktopNavLinkClasses,
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <div className="flex min-h-screen flex-col">
        <main className="app-shell-main">
          <Outlet />
        </main>
        <nav aria-label={copy.shell.mobileNavigationLabel} className="app-shell-mobile-nav">
          <div className="grid grid-cols-4 gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                aria-label={link.label}
                className={({ isActive }) =>
                  cn(
                    mobileNavLinkClasses,
                    isActive ? activeNavLinkClasses : inactiveMobileNavLinkClasses,
                  )
                }
              >
                <link.icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.9} />
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
