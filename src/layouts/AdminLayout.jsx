import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    name: "Roles",
    path: "/admin/roles",
    icon: ShieldCheck,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <header className="bg-primary-950 text-white">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-lg font-bold tracking-[0.18em]">
              AUREVIA
            </p>

            <p className="mt-1 text-xs text-stone-300">
              Administrator Workspace
            </p>
          </div>

          <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-stone-300">
            System Administration
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] lg:grid lg:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="border-b border-stone-200 bg-white lg:min-h-[calc(100vh-81px)] lg:border-b-0 lg:border-r">
          <nav className="flex gap-2 overflow-x-auto p-4 lg:flex-col lg:p-5">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    [
                      "flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition",
                      isActive
                        ? "bg-primary-950 text-white"
                        : "text-stone-600 hover:bg-primary-50 hover:text-primary-900",
                    ].join(" ")
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          <div className="mx-5 mb-5 hidden rounded-xl bg-primary-50 p-4 lg:block">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary-700">
              Administration
            </p>

            <p className="mt-2 text-xs leading-5 text-primary-900">
              Manage system users, access roles, reporting and application
              configuration.
            </p>
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}