/* oxlint-disable react/set-state-in-effect */

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CircleAlert,
  Edit3,
  Mail,
  MapPin,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import {
  getCustomerProfile,
  updateCustomerProfile,
} from "../../api/customerApi";
import {
  getAuth,
  saveAuth,
} from "../../api/authStorage";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  street: "",
  city: "",
  province: "",
  postalCode: "",
  phoneNumbers: "",
};

export default function CustomerProfilePage() {
  const auth = getAuth();
  const customerId = auth?.userId;

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] =
    useState(EMPTY_FORM);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      if (!customerId) {
        setError(
          "Authenticated customer information is unavailable.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response =
          await getCustomerProfile(customerId);

        setProfile(response);
        setFormData(toFormData(response));
      } catch (loadError) {
        setError(
          getErrorMessage(
            loadError,
            "Unable to load customer profile.",
          ),
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [customerId]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function startEditing() {
    setFormData(toFormData(profile));
    setMessage("");
    setError("");
    setEditing(true);
  }

  function cancelEditing() {
    setFormData(toFormData(profile));
    setError("");
    setEditing(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      setError(
        "First name, last name and email are required.",
      );
      return;
    }

    const phoneNumbers = formData.phoneNumbers
      .split(",")
      .map((phone) => phone.trim())
      .filter(Boolean);

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      street: normalizeOptional(
        formData.street,
      ),
      city: normalizeOptional(formData.city),
      province: normalizeOptional(
        formData.province,
      ),
      postalCode: normalizeOptional(
        formData.postalCode,
      ),
      phoneNumbers,
    };

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const updatedProfile =
        await updateCustomerProfile(
          customerId,
          payload,
        );

      setProfile(updatedProfile);
      setFormData(toFormData(updatedProfile));
      setEditing(false);

      saveAuth({
        ...auth,
        email: updatedProfile.email,
        firstName: updatedProfile.firstName,
        lastName: updatedProfile.lastName,
      });

      setMessage(
        "Customer profile updated successfully.",
      );
    } catch (saveError) {
      setError(
        getErrorMessage(
          saveError,
          "Unable to update customer profile.",
        ),
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white px-6 py-16 text-center">
        <User className="mx-auto h-8 w-8 text-primary-700" />

        <p className="mt-4 text-sm text-stone-600">
          Loading customer profile...
        </p>
      </div>
    );
  }

  return (
    <div>
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
          My Account
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950 sm:text-4xl">
          Customer profile
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-stone-600">
          View and manage the personal information
          associated with your Aurevia account.
        </p>
      </section>

      {message && (
        <section className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-800">
          {message}
        </section>
      )}

      {error && (
        <section className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </section>
      )}

      {profile && (
        <div className="mt-8 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50">
              <User className="h-7 w-7 text-primary-700" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-primary-950">
              {profile.firstName}{" "}
              {profile.lastName}
            </h2>

            <p className="mt-1 break-words text-sm text-stone-600">
              {profile.email}
            </p>

            <div className="mt-6 border-t border-stone-200 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Account Type
              </p>

              <p className="mt-2 text-sm font-semibold text-primary-900">
                Customer
              </p>
            </div>

            <div className="mt-5 border-t border-stone-200 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Customer ID
              </p>

              <p className="mt-2 text-sm font-semibold text-primary-900">
                #{profile.customerId}
              </p>
            </div>

            <div className="mt-5 border-t border-stone-200 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">
                Member Since
              </p>

              <p className="mt-2 text-sm font-semibold text-primary-900">
                {formatDate(
                  profile.registrationDate,
                )}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white">
            <div className="flex flex-col gap-4 border-b border-stone-200 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-primary-950">
                  Personal information
                </h2>

                <p className="mt-1 text-sm text-stone-600">
                  Information stored with your
                  Aurevia account.
                </p>
              </div>

              {!editing && (
                <button
                  type="button"
                  onClick={startEditing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {editing ? (
              <ProfileForm
                formData={formData}
                saving={saving}
                onChange={handleInputChange}
                onSubmit={handleSubmit}
                onCancel={cancelEditing}
              />
            ) : (
              <ProfileDetails
                profile={profile}
              />
            )}
          </section>
        </div>
      )}

      <section className="mt-8 rounded-2xl bg-primary-950 p-6 text-white sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gold-400">
          Connected Account
        </p>

        <h2 className="mt-3 text-xl font-semibold">
          One profile connects your Aurevia
          services
        </h2>

        <div className="mt-7 grid gap-6 md:grid-cols-4">
          <FlowStep
            number="01"
            title="Authenticate"
            text="Your login securely identifies your customer account."
          />

          <FlowStep
            number="02"
            title="Reserve"
            text="Your table and venue bookings remain associated with this account."
          />

          <FlowStep
            number="03"
            title="Manage"
            text="Update your contact and address information when required."
          />

          <FlowStep
            number="04"
            title="Access"
            text="Use the same account for events, feedback, invoices and payments."
          />
        </div>
      </section>
    </div>
  );
}

function ProfileDetails({ profile }) {
  const address = [
    profile.street,
    profile.city,
    profile.province,
    profile.postalCode,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="grid gap-6 p-6 sm:grid-cols-2">
      <ProfileField
        icon={User}
        label="First Name"
        value={profile.firstName}
      />

      <ProfileField
        icon={User}
        label="Last Name"
        value={profile.lastName}
      />

      <ProfileField
        icon={Mail}
        label="Email Address"
        value={profile.email}
      />

      <ProfileField
        icon={Phone}
        label="Telephone Numbers"
        value={
          profile.phoneNumbers?.length
            ? profile.phoneNumbers.join(", ")
            : "Not provided"
        }
      />

      <ProfileField
        icon={MapPin}
        label="Address"
        value={address || "Not provided"}
      />

      <ProfileField
        icon={CalendarDays}
        label="Registration Date"
        value={formatDate(
          profile.registrationDate,
        )}
      />
    </div>
  );
}

function ProfileForm({
  formData,
  saving,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-5 p-6 sm:grid-cols-2"
    >
      <FormField label="First Name">
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={onChange}
          required
          maxLength={50}
          className={inputClasses}
        />
      </FormField>

      <FormField label="Last Name">
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={onChange}
          required
          maxLength={50}
          className={inputClasses}
        />
      </FormField>

      <FormField label="Email Address">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onChange}
          required
          maxLength={150}
          className={inputClasses}
        />
      </FormField>

      <FormField label="Phone Numbers">
        <input
          type="text"
          name="phoneNumbers"
          value={formData.phoneNumbers}
          onChange={onChange}
          maxLength={120}
          placeholder="0711111111, 0771234567"
          className={inputClasses}
        />

        <p className="mt-2 text-xs text-stone-500">
          Separate multiple numbers with commas.
        </p>
      </FormField>

      <FormField label="Street">
        <input
          type="text"
          name="street"
          value={formData.street}
          onChange={onChange}
          maxLength={150}
          className={inputClasses}
        />
      </FormField>

      <FormField label="City">
        <input
          type="text"
          name="city"
          value={formData.city}
          onChange={onChange}
          maxLength={80}
          className={inputClasses}
        />
      </FormField>

      <FormField label="Province">
        <input
          type="text"
          name="province"
          value={formData.province}
          onChange={onChange}
          maxLength={80}
          className={inputClasses}
        />
      </FormField>

      <FormField label="Postal Code">
        <input
          type="text"
          name="postalCode"
          value={formData.postalCode}
          onChange={onChange}
          maxLength={20}
          className={inputClasses}
        />
      </FormField>

      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />

          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}

function ProfileField({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-700" />

        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          {label}
        </p>
      </div>

      <div className="mt-3 break-words rounded-xl bg-stone-50 px-4 py-3 text-sm font-medium text-primary-950">
        {value || "—"}
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-primary-950">
        {label}
      </span>

      {children}
    </label>
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

function toFormData(profile) {
  if (!profile) {
    return EMPTY_FORM;
  }

  return {
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    street: profile.street || "",
    city: profile.city || "",
    province: profile.province || "",
    postalCode: profile.postalCode || "",
    phoneNumbers:
      profile.phoneNumbers?.join(", ") || "",
  };
}

function normalizeOptional(value) {
  const normalized = value.trim();
  return normalized || null;
}

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(value));
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallback
  );
}

const inputClasses =
  "w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-primary-500";