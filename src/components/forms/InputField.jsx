export default function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder = "",
  required = false,
  disabled = false,
  error = "",
  helperText = "",
}) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-stone-700"
        >
          {label}

          {required && (
            <span className="ml-1 text-red-500">*</span>
          )}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-stone-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
          }
          disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500
        `}
      />

      {error ? (
        <p className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-sm text-stone-500">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}