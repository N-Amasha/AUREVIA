import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  ChefHat,
  Info,
  Search,
  ShoppingBasket,
  Users,
} from "lucide-react";

import Button from "../../components/ui/Button";
import { menuItems } from "../../data/menuData";

export default function CustomizeCateringMenuPage() {
  const [eventName, setEventName] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [errors, setErrors] = useState({});
  const [previewReady, setPreviewReady] = useState(false);

  const filteredItems = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return menuItems;
    }

    return menuItems.filter((item) =>
      [item.name, item.description, item.category]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search)
    );
  }, [searchTerm]);

  function toggleItem(itemId) {
    setSelectedItems((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    );

    setErrors((current) => ({
      ...current,
      selectedItems: "",
    }));

    setPreviewReady(false);
  }

  function handlePreview() {
    const newErrors = {};

    if (!eventName.trim()) {
      newErrors.eventName = "Event name is required.";
    }

    if (!guestCount) {
      newErrors.guestCount = "Guest count is required.";
    } else if (Number(guestCount) < 1) {
      newErrors.guestCount = "Guest count must be at least 1.";
    }

    if (selectedItems.length === 0) {
      newErrors.selectedItems =
        "Select at least one menu item.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setPreviewReady(false);
      return;
    }

    setErrors({});
    setPreviewReady(true);
  }

  const selectedMenuItems = menuItems.filter((item) =>
    selectedItems.includes(item.id)
  );

  return (
    <div>
      {/* Back */}
      <Link
        to="/customer/menu"
        className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 transition hover:text-primary-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Menu
      </Link>

      {/* Header */}
      <section className="mt-7">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          Catering Menu
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Customize your catering menu
        </h1>

        <p className="mt-3 max-w-2xl leading-7 text-stone-600">
          Create a catering menu preview by selecting suitable dishes
          for your event.
        </p>
      </section>

      {/* Demo Notice */}
      <section className="mt-8 rounded-2xl border border-gold-200 bg-gold-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Frontend customization preview
            </h2>

            <p className="mt-1 text-sm leading-6 text-stone-600">
              Menu selections on this page are temporary frontend state.
              Creating and saving a catering package will be implemented
              after the backend is connected.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {/* Event Details */}
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <ChefHat className="h-5 w-5 text-primary-800" />

              <h2 className="text-lg font-semibold text-primary-950">
                Event details
              </h2>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="eventName"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Event Name
                </label>

                <input
                  id="eventName"
                  type="text"
                  value={eventName}
                  onChange={(event) => {
                    setEventName(event.target.value);
                    setErrors((current) => ({
                      ...current,
                      eventName: "",
                    }));
                    setPreviewReady(false);
                  }}
                  placeholder="Example: Annual Dinner"
                  className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition ${
                    errors.eventName
                      ? "border-red-400"
                      : "border-stone-300 focus:border-primary-600"
                  }`}
                />

                {errors.eventName && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.eventName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="guestCount"
                  className="mb-2 block text-sm font-medium text-stone-700"
                >
                  Number of Guests
                </label>

                <div className="relative">
                  <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

                  <input
                    id="guestCount"
                    type="number"
                    min="1"
                    value={guestCount}
                    onChange={(event) => {
                      setGuestCount(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        guestCount: "",
                      }));
                      setPreviewReady(false);
                    }}
                    placeholder="Guest count"
                    className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition ${
                      errors.guestCount
                        ? "border-red-400"
                        : "border-stone-300 focus:border-primary-600"
                    }`}
                  />
                </div>

                {errors.guestCount && (
                  <p className="mt-2 text-xs text-red-600">
                    {errors.guestCount}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Menu Selection */}
          <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-6">
            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Select menu items
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Choose the dishes you want to include in this catering
                menu.
              </p>
            </div>

            <div className="relative mt-5">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

              <input
                type="search"
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                placeholder="Search menu items"
                className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-primary-600"
              />
            </div>

            {errors.selectedItems && (
              <p className="mt-3 text-xs text-red-600">
                {errors.selectedItems}
              </p>
            )}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {filteredItems.map((item) => {
                const selected = selectedItems.includes(item.id);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`rounded-xl border p-4 text-left transition ${
                      selected
                        ? "border-primary-700 bg-primary-50"
                        : "border-stone-200 bg-white hover:border-primary-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gold-600">
                          {item.category}
                        </p>

                        <h3 className="mt-1 font-semibold text-primary-950">
                          {item.name}
                        </h3>
                      </div>

                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                          selected
                            ? "border-primary-800 bg-primary-800 text-white"
                            : "border-stone-300"
                        }`}
                      >
                        {selected && <Check className="h-3.5 w-3.5" />}
                      </div>
                    </div>

                    {item.description && (
                      <p className="mt-2 text-xs leading-5 text-stone-500">
                        {item.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>

            {filteredItems.length === 0 && (
              <div className="mt-5 rounded-xl border border-dashed border-stone-300 bg-cream-50 p-8 text-center">
                <p className="text-sm text-stone-600">
                  No menu items match your search.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Selection Summary */}
        <aside className="h-fit rounded-2xl border border-stone-200 bg-white p-6 xl:sticky xl:top-8">
          <div className="flex items-center gap-3">
            <ShoppingBasket className="h-5 w-5 text-primary-800" />

            <h2 className="font-semibold text-primary-950">
              Your Selection
            </h2>
          </div>

          <p className="mt-2 text-sm text-stone-500">
            {selectedItems.length} item
            {selectedItems.length === 1 ? "" : "s"} selected
          </p>

          {selectedMenuItems.length > 0 ? (
            <div className="mt-5 space-y-3">
              {selectedMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl bg-cream-50 p-3"
                >
                  <p className="text-sm font-medium text-primary-950">
                    {item.name}
                  </p>

                  <p className="mt-1 text-xs text-stone-500">
                    {item.category}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-xl border border-dashed border-stone-300 p-5 text-center">
              <p className="text-xs leading-5 text-stone-500">
                Selected menu items will appear here.
              </p>
            </div>
          )}

          <Button
            type="button"
            onClick={handlePreview}
            className="mt-6 w-full"
          >
            Preview Catering Menu
          </Button>
        </aside>
      </div>

      {/* Preview */}
      {previewReady && (
        <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary-700">
            Catering Preview
          </p>

          <h2 className="mt-2 text-xl font-semibold text-primary-950">
            {eventName}
          </h2>

          <p className="mt-2 text-sm text-primary-800">
            Planned for {guestCount} guest
            {Number(guestCount) === 1 ? "" : "s"} with{" "}
            {selectedItems.length} selected menu item
            {selectedItems.length === 1 ? "" : "s"}.
          </p>

          <p className="mt-4 text-xs leading-5 text-primary-700">
            This is a frontend preview only. No catering package has been
            saved or submitted.
          </p>
        </section>
      )}
    </div>
  );
}