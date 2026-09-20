export default function TextAreaField({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  required = false,
  disabled = false,
  error = "",
  helperText = "",
  maxLength,
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

      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        className={`w-full resize-none rounded-lg border bg-white px-4 py-3 text-sm text-stone-900 outline-none transition
          ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-stone-300 focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
          }
          disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500
        `}
      />

      <div className="mt-1.5 flex justify-between gap-4">
        <div>
          {error ? (
            <p className="text-sm text-red-600">{error}</p>
          ) : helperText ? (
            <p className="text-sm text-stone-500">{helperText}</p>
          ) : null}
        </div>

        {maxLength && (
          <p className="text-xs text-stone-400">
            {value?.length || 0}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}