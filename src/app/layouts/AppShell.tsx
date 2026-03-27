import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/routines", label: "Routines" },
  { to: "/exercises", label: "Exercises" },
  { to: "/profile", label: "Profile" },
];

export default function AppShell() {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[280px_1fr] md:gap-8 md:px-6 md:pb-8 md:pt-6">
      <aside className="hidden md:block">
        <div className="panel-card sticky top-6 p-6">
          <div className="eyebrow">Gainly</div>
          <p className="mt-3 text-xl font-semibold tracking-tight">Performance Console</p>
          <nav aria-label="Primary navigation" className="mt-8 flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 text-sm transition ${
                    isActive ? "bg-white/12 text-white" : "text-white/80 hover:bg-white/7"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 px-4 pb-28 pt-6 md:px-0 md:pb-0 md:pt-2">
          <Outlet />
        </main>
        <nav
          aria-label="Primary mobile navigation"
          className="fixed inset-x-4 bottom-4 z-20 rounded-[26px] border border-white/10 bg-[hsl(var(--background))]/95 p-2 shadow-[0_18px_48px_rgba(0,0,0,0.35)] backdrop-blur md:hidden"
        >
          <div className="grid grid-cols-4 gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-2xl px-2 py-2 text-center text-[11px] uppercase tracking-[0.16em] transition ${
                    isActive ? "bg-white/12 text-white" : "text-white/75"
                  }`
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
