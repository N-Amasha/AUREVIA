import { useState } from "react";
import {
  Bell,
  Building2,
  Info,
  LockKeyhole,
  Save,
  Settings,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    systemName: "Aurevia",
    supportEmail: "",
    reservationNotifications: true,
    paymentNotifications: true,
    lowStockNotifications: true,
  });

  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setSettings((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));

    setMessage("");
  }

  function handlePreview(event) {
    event.preventDefault();

    setMessage(
      "Settings preview prepared. These changes have not been saved."
    );
  }

  return (
    <div>
      {/* Header */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          System Administration
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          System settings
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          Review general Aurevia configuration and future notification
          preferences from the administrator workspace.
        </p>
      </section>

      {/* Notice */}
      <section className="mt-8 rounded-2xl border border-primary-200 bg-primary-50 p-5">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />

          <div>
            <h2 className="font-semibold text-primary-950">
              Settings persistence is not connected
            </h2>

            <p className="mt-1 text-sm leading-6 text-primary-800">
              Changes on this page currently remain in local React state.
              Persistent configuration and administrator authorization will
              be implemented through the Spring Boot backend.
            </p>
          </div>
        </div>
      </section>

      <form onSubmit={handlePreview} className="mt-8 space-y-8">
        {/* General */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Building2 className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                General configuration
              </h2>

              <p className="mt-1 text-sm text-stone-600">
                Basic application information for future system
                configuration.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-stone-700">
                System Name
              </span>

              <input
                name="systemName"
                value={settings.systemName}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-600"
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-stone-700">
                Support Email
              </span>

              <input
                type="email"
                name="supportEmail"
                value={settings.supportEmail}
                onChange={handleChange}
                placeholder="Enter support email"
                className="mt-2 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-600"
              />
            </label>
          </div>
        </section>

        {/* Notifications */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Bell className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Operational notifications
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Preview which operational events may later generate system
                notifications.
              </p>
            </div>
          </div>

          <div className="mt-6 divide-y divide-stone-200">
            <SettingToggle
              name="reservationNotifications"
              checked={settings.reservationNotifications}
              onChange={handleChange}
              title="Reservation notifications"
              description="Future notifications related to reservation activity."
            />

            <SettingToggle
              name="paymentNotifications"
              checked={settings.paymentNotifications}
              onChange={handleChange}
              title="Payment verification notifications"
              description="Future notifications related to submitted and verified payment slips."
            />

            <SettingToggle
              name="lowStockNotifications"
              checked={settings.lowStockNotifications}
              onChange={handleChange}
              title="Low-stock notifications"
              description="Future notifications when inventory reaches configured stock conditions."
            />
          </div>
        </section>

        {/* Security */}
        <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-1 h-5 w-5 text-primary-700" />

            <div>
              <h2 className="text-lg font-semibold text-primary-950">
                Security configuration
              </h2>

              <p className="mt-1 text-sm leading-6 text-stone-600">
                Authentication, password security, JWT handling and
                authorization will be configured in the backend rather than
                trusted to browser-side settings.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-stone-50 p-5">
            <p className="text-sm font-semibold text-primary-950">
              Backend-controlled
            </p>

            <p className="mt-2 text-sm leading-6 text-stone-600">
              Security-sensitive configuration is intentionally not editable
              from this frontend prototype.
            </p>
          </div>
        </section>

        {/* Preview result */}
        {message && (
          <section className="rounded-2xl border border-gold-200 bg-gold-50 p-5">
            <div className="flex items-start gap-3">
              <Settings className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" />

              <div>
                <h2 className="font-semibold text-primary-950">
                  Settings preview
                </h2>

                <p className="mt-1 text-sm text-stone-700">
                  {message}
                </p>
              </div>
            </div>
          </section>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-800"
          >
            <Save className="h-4 w-4" />
            Preview Settings
          </button>
        </div>
      </form>
    </div>
  );
}

function SettingToggle({
  name,
  checked,
  onChange,
  title,
  description,
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-5 py-5">
      <div>
        <p className="text-sm font-semibold text-primary-950">
          {title}
        </p>

        <p className="mt-1 text-sm leading-6 text-stone-600">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-1 h-5 w-5 accent-primary-800"
      />
    </label>
  );
}