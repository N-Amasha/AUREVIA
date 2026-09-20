import { NavLink, Outlet } from "react-router-dom";
import {
  CalendarDays,
  LayoutDashboard,
  ListChecks,
  MessageSquareHeart,
  Store,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    path: "/event-coordinator",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Events",
    path: "/event-coordinator/events",
    icon: CalendarDays,
  },
  {
    label: "Timelines",
    path: "/event-coordinator/timelines",
    icon: ListChecks,
  },
  {
    label: "Vendors",
    path: "/event-coordinator/vendors",
    icon: Store,
  },
  {
    label: "Feedback",
    path: "/event-coordinator/feedback",
    icon: MessageSquareHeart,
  },
];

export default function EventCoordinatorLayout() {
  return (
    <div className="min-h-screen bg-cream-50">
      <div className="border-b border-stone-200 bg-primary-950 px-5 py-5 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-xl font-bold tracking-wide">
            AUREVIA
          </p>

          <p className="mt-1 text-xs text-stone-300">
            Event Coordinator Workspace
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl lg:grid-cols-[240px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="border-b border-stone-200 bg-white p-4 lg:min-h-[calc(100vh-85px)] lg:border-b-0 lg:border-r">
          <nav className="flex gap-2 overflow-x-auto lg:flex-col">
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-primary-900 text-white"
                        : "text-stone-600 hover:bg-primary-50 hover:text-primary-900"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Page */}
        <main className="min-w-0 p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}