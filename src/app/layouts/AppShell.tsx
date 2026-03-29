import { NavLink, Outlet } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/routines", label: "Routines" },
  { to: "/exercises", label: "Exercises" },
  { to: "/profile", label: "Profile" },
];

export default function AppShell() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950 md:grid md:grid-cols-[280px_1fr]">
      <aside className="hidden min-h-screen border-r border-zinc-200 bg-white md:flex md:flex-col">
        <div className="flex h-full flex-col px-6 py-8">
          <div className="eyebrow">Gainly</div>
          <p className="mt-3 text-xl font-semibold tracking-tight">Training OS</p>
          <nav aria-label="Primary navigation" className="mt-10 flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-4 py-3 text-sm font-medium transition ${
                    isActive ? "bg-zinc-950 text-white" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">Mode</p>
            <p className="mt-2 text-sm font-medium text-zinc-700">Monochrome Athletic</p>
          </div>
        </div>
      </aside>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 px-4 pb-24 pt-6 md:px-10 md:pb-10 md:pt-10">
          <Outlet />
        </main>
        <nav
          aria-label="Primary mobile navigation"
          className="fixed inset-x-3 bottom-3 z-20 rounded-xl border border-zinc-200 bg-white/95 p-2 shadow-sm md:hidden"
        >
          <div className="grid grid-cols-4 gap-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-md px-2 py-2 text-center text-[11px] uppercase tracking-[0.16em] transition ${
                    isActive ? "bg-zinc-950 text-white" : "text-zinc-500"
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
