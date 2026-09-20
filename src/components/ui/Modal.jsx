import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  description = "",
  children,
  footer,
  size = "md",
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Background overlay */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-black/50 backdrop-blur-sm"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative z-10 w-full ${sizes[size]} rounded-2xl bg-white shadow-2xl`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-stone-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm leading-6 text-stone-500">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[65vh] overflow-y-auto px-6 py-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-stone-200 bg-stone-50 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}