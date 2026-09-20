import { Check } from "lucide-react";

export default function Checkbox({
  label,
  name,
  checked = false,
  onChange,
  disabled = false,
  description = "",
}) {
  return (
    <label
      htmlFor={name}
      className={`flex items-start gap-3 ${
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
    >
      <div className="relative mt-0.5">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
        />

        <div className="flex h-5 w-5 items-center justify-center rounded border border-stone-300 bg-white transition peer-checked:border-primary-700 peer-checked:bg-primary-700 peer-focus-visible:ring-2 peer-focus-visible:ring-primary-300 peer-focus-visible:ring-offset-2">
          {checked && (
            <Check
              className="h-3.5 w-3.5 text-white"
              strokeWidth={3}
            />
          )}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-stone-800">
          {label}
        </p>

        {description && (
          <p className="mt-0.5 text-xs leading-5 text-stone-500">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}