import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/routines", label: "Routines" },
  { to: "/exercises", label: "Exercises" },
  { to: "/profile", label: "Profile" },
];

export default function AppShell() {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="hidden border-r border-white/10 bg-white/5 p-6 md:block">
        <div className="text-sm uppercase tracking-[0.24em] text-white/55">Gainly</div>
        <nav aria-label="Primary navigation" className="mt-8 flex flex-col gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="rounded-2xl px-4 py-3 text-sm text-white/80 hover:bg-white/5"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-8">
          <Outlet />
        </main>
        <nav
          aria-label="Primary mobile navigation"
          className="fixed inset-x-0 bottom-0 flex border-t border-white/10 bg-[hsl(var(--background))]/95 px-3 py-3 md:hidden"
        >
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="flex-1 rounded-2xl px-3 py-2 text-center text-xs text-white/80"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
