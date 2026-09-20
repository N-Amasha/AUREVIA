import { Upload, FileText, X } from "lucide-react";

export default function FileUpload({
  label,
  name,
  file,
  onChange,
  onRemove,
  accept = "image/*,.pdf",
  required = false,
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

      {!file ? (
        <label
          htmlFor={name}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition
            ${
              error
                ? "border-red-300 bg-red-50"
                : "border-stone-300 bg-white hover:border-primary-500 hover:bg-primary-50/50"
            }`}
        >
          <Upload className="h-8 w-8 text-primary-700" />

          <p className="mt-3 text-sm font-medium text-stone-800">
            Click to choose a file
          </p>

          <p className="mt-1 text-xs text-stone-500">
            JPG, PNG or PDF
          </p>

          <input
            id={name}
            name={name}
            type="file"
            accept={accept}
            required={required}
            onChange={onChange}
            className="hidden"
          />
        </label>
      ) : (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
              <FileText className="h-5 w-5 text-primary-700" />
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-stone-800">
                {file.name}
              </p>

              <p className="text-xs text-stone-500">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg p-2 text-stone-400 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Remove selected file"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

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