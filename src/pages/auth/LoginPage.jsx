import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

import Button from "../../components/ui/Button";
import { login as authenticateUser } from "../../api/authApi";

const ROLE_HOME_ROUTES = {
  CUSTOMER: "/customer",
  ADMINISTRATOR: "/admin",
  CASHIER: "/cashier",
  EVENT_COORDINATOR: "/event-coordinator",
  INVENTORY_MANAGER: "/inventory",
  HR_MANAGER: "/hr",
  RESTAURANT_MANAGER: "/restaurant-manager",
  CHEF: "/chef",
  RESTAURANT_STAFF: "/staff",
EMPLOYEE: "/staff",
};

export default function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] =
    useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setServerError("");
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/\S+@\S+\.\S+/.test(formData.email)
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    }

    return newErrors;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setServerError("");
    setIsSubmitting(true);

    try {
      const authData = await authenticateUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      const destination =
        ROLE_HOME_ROUTES[authData.role] ?? "/";

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      setServerError(
        error.response?.data?.message ??
          "Unable to sign in. Please check that the backend is running and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
        Account Access
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950">
        Welcome back
      </h1>

      <p className="mt-3 text-sm leading-6 text-stone-600">
        Sign in to access your Aurevia
        account.
      </p>

      {serverError && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
        noValidate
      >
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Email Address
          </label>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting}
              className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-stone-100 ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-stone-300 focus:border-primary-600"
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-2 text-xs text-red-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-sm font-medium text-stone-700"
            >
              Password
            </label>

            <span className="text-xs text-stone-400">
              Secure access
            </span>
          </div>

          <div className="relative">
            <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              id="password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={isSubmitting}
              className={`w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm outline-none transition disabled:cursor-not-allowed disabled:bg-stone-100 ${
                errors.password
                  ? "border-red-400 focus:border-red-500"
                  : "border-stone-300 focus:border-primary-600"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              disabled={isSubmitting}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-primary-700 disabled:cursor-not-allowed"
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-2 text-xs text-red-600">
              {errors.password}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Signing In..."
            : "Sign In"}
        </Button>
      </form>

      <div className="mt-8 border-t border-stone-200 pt-6 text-center">
        <p className="text-sm text-stone-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary-800 transition hover:text-primary-950"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}