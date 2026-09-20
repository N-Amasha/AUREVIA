import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
});

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

    setSubmitted(false);
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must contain at least 8 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitted(true);
  }

  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
        Create Your Account
      </p>

      <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary-950">
        Join Aurevia
      </h1>

      <p className="mt-3 text-sm leading-6 text-stone-600">
        Create a customer account to access Aurevia dining and event
        features.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        {/* Name */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              First Name
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                autoComplete="given-name"
                className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition ${
                  errors.firstName
                    ? "border-red-400 focus:border-red-500"
                    : "border-stone-300 focus:border-primary-600"
                }`}
              />
            </div>

            {errors.firstName && (
              <p className="mt-2 text-xs text-red-600">
                {errors.firstName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Last Name
            </label>

            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                autoComplete="family-name"
                className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition ${
                  errors.lastName
                    ? "border-red-400 focus:border-red-500"
                    : "border-stone-300 focus:border-primary-600"
                }`}
              />
            </div>

            {errors.lastName && (
              <p className="mt-2 text-xs text-red-600">
                {errors.lastName}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
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
              className={`w-full rounded-xl border bg-white py-3 pl-10 pr-4 text-sm outline-none transition ${
                errors.email
                  ? "border-red-400 focus:border-red-500"
                  : "border-stone-300 focus:border-primary-600"
              }`}
            />
          </div>

          {errors.email && (
            <p className="mt-2 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Password
          </label>

          <div className="relative">
            <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              autoComplete="new-password"
              className={`w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm outline-none transition ${
                errors.password
                  ? "border-red-400 focus:border-red-500"
                  : "border-stone-300 focus:border-primary-600"
              }`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-primary-700"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.password ? (
            <p className="mt-2 text-xs text-red-600">{errors.password}</p>
          ) : (
            <p className="mt-2 text-xs text-stone-500">
              Use at least 8 characters.
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Confirm Password
          </label>

          <div className="relative">
            <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />

            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Enter your password again"
              autoComplete="new-password"
              className={`w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm outline-none transition ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500"
                  : "border-stone-300 focus:border-primary-600"
              }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword((current) => !current)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 transition hover:text-primary-700"
              aria-label={
                showConfirmPassword
                  ? "Hide confirmed password"
                  : "Show confirmed password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="mt-2 text-xs text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>

      {submitted && (
        <div className="mt-5">
          <Alert variant="info">
            Registration details are valid. Account creation will be
            completed when the Aurevia backend authentication service is
            connected.
          </Alert>
        </div>
      )}

      <div className="mt-8 border-t border-stone-200 pt-6 text-center">
        <p className="text-sm text-stone-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-primary-800 transition hover:text-primary-950"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}