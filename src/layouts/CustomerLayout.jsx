import { NavLink, Outlet } from "react-router-dom";
import {
  CalendarCheck,
  CalendarDays,
  ChefHat,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareHeart,
  UserRound,
  X,
} from "lucide-react";
import { useState } from "react";

export default function CustomerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    {
      label: "Dashboard",
      path: "/customer",
      icon: LayoutDashboard,
      end: true,
    },
    {
      label: "Reservations",
      path: "/customer/reservations",
      icon: CalendarCheck,
    },
    {
      label: "Menu",
      path: "/customer/menu",
      icon: ChefHat,
    },
    {
      label: "My Events",
      path: "/customer/events",
      icon: CalendarDays,
    },
    {
      label: "Billing & Payments",
      path: "/customer/billing",
      icon: CreditCard,
    },
    {
      label: "Feedback",
      path: "/customer/feedback",
      icon: MessageSquareHeart,
    },
    {
      label: "Profile",
      path: "/customer/profile",
      icon: UserRound,
    },
  ];

  const navStyles = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-primary-900 text-white"
        : "text-stone-600 hover:bg-primary-50 hover:text-primary-900"
    }`;

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-stone-200 bg-white lg:flex lg:flex-col">
        <div className="border-b border-stone-200 px-7 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-900 font-bold text-white">
              A
            </div>

            <div>
              <p className="font-bold tracking-[0.14em] text-primary-950">
                AUREVIA
              </p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-gold-600">
                Customer Portal
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-5">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={navStyles}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-stone-200 p-5">
          <button
            type="button"
            disabled
            className="flex w-full cursor-not-allowed items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-stone-400"
            title="Available after authentication integration"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-stone-200 bg-white px-5 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-900 font-bold text-white">
            A
          </div>

          <span className="font-bold tracking-[0.12em] text-primary-950">
            AUREVIA
          </span>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-primary-950 hover:bg-primary-50"
          aria-label="Open customer navigation"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close customer navigation"
          />

          <aside className="relative flex h-full w-72 flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-5 py-5">
              <div>
                <p className="font-bold tracking-[0.12em] text-primary-950">
                  AUREVIA
                </p>
                <p className="text-[10px] uppercase tracking-[0.16em] text-gold-600">
                  Customer Portal
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-2 text-stone-600 hover:bg-stone-100"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto p-5">
              {navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={navStyles}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Customer Page Content */}
      <main className="lg:ml-72">
        <div className="mx-auto max-w-7xl p-6 sm:p-8 lg:p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}