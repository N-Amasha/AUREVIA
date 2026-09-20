export default function SelectField({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
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

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
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
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

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