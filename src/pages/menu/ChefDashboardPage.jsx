/* oxlint-disable react/set-state-in-effect */

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  ListTree,
  RefreshCw,
  UtensilsCrossed,
} from "lucide-react";
import {
  getActiveMenus,
  getAllMenuItems,
} from "../../api/menuApi";

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Unable to load the Chef dashboard."
  );
}

export default function ChefDashboardPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [activeMenus, setActiveMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const actions = [
    {
      title: "Manage Menu Items",
      description:
        "Create and maintain dishes, prices, descriptions and availability.",
      icon: UtensilsCrossed,
      path: "/chef/menu-items",
    },
    {
      title: "Review Categories",
      description:
        "Review the categories assigned to authoritative menu-item records.",
      icon: ListTree,
      path: "/chef/categories",
    },
  ];

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const [menuItemData, activeMenuData] =
        await Promise.all([
          getAllMenuItems(),
          getActiveMenus(),
        ]);

      setMenuItems(
        Array.isArray(menuItemData)
          ? menuItemData
          : [],
      );

      setActiveMenus(
        Array.isArray(activeMenuData)
          ? activeMenuData
          : [],
      );
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setMenuItems([]);
      setActiveMenus([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const categoryCount = useMemo(() => {
    return new Set(
      menuItems
        .map((item) => item.category?.trim())
        .filter(Boolean),
    ).size;
  }, [menuItems]);

  const availableItemCount = menuItems.filter(
    (item) =>
      item.availabilityStatus?.toUpperCase() ===
      "AVAILABLE",
  ).length;

  return (
    <div>
      {/* Header */}
      <section className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
            Menu Operations
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
            Chef dashboard
          </h1>

          <p className="mt-3 max-w-3xl leading-7 text-stone-600">
            Manage the authoritative menu information
            supporting customer dining, catering
            customization and food orders.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDashboard}
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-primary-950 transition hover:border-primary-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isLoading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </section>

      {/* Error */}
      {errorMessage && (
        <section className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {errorMessage}
        </section>
      )}

      {/* Summary */}
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={UtensilsCrossed}
          label="Menu Items"
          value={menuItems.length}
        />

        <SummaryCard
          icon={UtensilsCrossed}
          label="Available Items"
          value={availableItemCount}
        />

        <SummaryCard
          icon={ListTree}
          label="Categories"
          value={categoryCount}
        />

        <SummaryCard
          icon={BookOpen}
          label="Active Menus"
          value={activeMenus.length}
        />
      </section>

      {/* Actions */}
      <section className="mt-10">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-600">
          Management
        </p>

        <h2 className="mt-2 text-xl font-semibold text-primary-950">
          Menu management
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {actions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.title}
                to={action.path}
                className="group rounded-2xl border border-stone-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50">
                  <Icon className="h-5 w-5 text-primary-700" />
                </div>

                <h3 className="mt-5 font-semibold text-primary-950">
                  {action.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {action.description}
                </p>

                <p className="mt-5 text-sm font-semibold text-primary-700">
                  Open →
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Active menus */}
      <section className="mt-10 overflow-hidden rounded-2xl border border-stone-200 bg-white">
        <div className="border-b border-stone-200 p-6">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Active menus
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Active menu records retrieved from the
                Aurevia database.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="px-6 py-12 text-center text-sm text-stone-600">
            Loading active menus...
          </div>
        ) : activeMenus.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-stone-600">
            No active menus are currently available.
          </div>
        ) : (
          <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
            {activeMenus.map((menu) => (
              <div
                key={menu.menuId}
                className="rounded-xl bg-stone-50 p-5"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                  {formatLabel(menu.menuType)}
                </p>

                <h3 className="mt-2 font-semibold text-primary-950">
                  {menu.menuName}
                </h3>

                <p className="mt-2 text-sm leading-6 text-stone-600">
                  {menu.description ||
                    "No description recorded."}
                </p>

                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {menu.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Connected workflow */}
      <section className="mt-10 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Connected Menu Flow
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          One authoritative menu supports multiple
          Aurevia functions
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Maintain"
            text="The Chef creates and updates authoritative menu-item records."
          />

          <FlowStep
            number="02"
            title="Publish"
            text="Available menu items can be presented through customer-facing menus."
          />

          <FlowStep
            number="03"
            title="Order"
            text="Customers use the same available records when creating food orders."
          />

          <FlowStep
            number="04"
            title="Reuse"
            text="Menu items can also support catering packages and event services."
          />
        </div>
      </section>
    </div>
  );
}

function formatLabel(value) {
  if (!value) {
    return "Not specified";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(" ");
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-5">
      <Icon className="h-5 w-5 text-primary-700" />

      <p className="mt-4 text-sm font-medium text-stone-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-primary-950">
        {value}
      </p>
    </div>
  );
}

function FlowStep({ number, title, text }) {
  return (
    <div>
      <p className="text-sm font-bold text-gold-400">
        {number}
      </p>

      <h3 className="mt-2 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-stone-300">
        {text}
      </p>
    </div>
  );
}
