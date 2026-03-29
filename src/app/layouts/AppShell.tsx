import { NavLink, Outlet } from "react-router-dom";
import { cn } from "../../lib/utils";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/routines", label: "Routines" },
  { to: "/exercises", label: "Exercises" },
  { to: "/profile", label: "Profile" },
];

const desktopNavLinkClasses =
  "rounded-md px-4 py-3 text-sm font-medium transition";
const mobileNavLinkClasses =
  "rounded-md px-2 py-2 text-center text-[11px] uppercase tracking-[0.16em] transition";
const activeNavLinkClasses = "bg-[hsl(var(--strong))] text-white";
const inactiveDesktopNavLinkClasses =
  "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--panel-inset))] hover:text-[hsl(var(--foreground))]";
const inactiveMobileNavLinkClasses = "text-[hsl(var(--muted-foreground))]";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] md:grid md:grid-cols-[280px_1fr]">
      <aside className="app-shell-sidebar hidden md:flex md:flex-col">
        <div className="flex h-full flex-col px-6 py-8">
          <div className="eyebrow">Gainly</div>
          <p className="mt-3 text-xl font-semibold tracking-tight">Training OS</p>
          <nav aria-label="Primary navigation" className="mt-10 flex flex-col gap-2">
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
          <div className="panel-inset mt-auto p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-[hsl(var(--muted-foreground))]">Mode</p>
            <p className="mt-2 text-sm font-medium text-[hsl(var(--foreground))]">Monochrome Athletic</p>
          </div>
        </div>
      </aside>
      <div className="flex min-h-screen flex-col">
        <main className="app-shell-main">
          <Outlet />
        </main>
        <nav aria-label="Primary mobile navigation" className="app-shell-mobile-nav">
          <div className="grid grid-cols-4 gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cn(
                    mobileNavLinkClasses,
                    isActive ? activeNavLinkClasses : inactiveMobileNavLinkClasses,
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
