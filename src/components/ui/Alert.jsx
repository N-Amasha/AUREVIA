import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from "lucide-react";

export default function Alert({
  type = "info",
  title,
  message,
  onClose,
}) {
  const variants = {
    success: {
      container: "border-green-200 bg-green-50",
      icon: "text-green-600",
      title: "text-green-900",
      message: "text-green-700",
      Icon: CheckCircle2,
    },

    warning: {
      container: "border-amber-200 bg-amber-50",
      icon: "text-amber-600",
      title: "text-amber-900",
      message: "text-amber-700",
      Icon: AlertTriangle,
    },

    error: {
      container: "border-red-200 bg-red-50",
      icon: "text-red-600",
      title: "text-red-900",
      message: "text-red-700",
      Icon: XCircle,
    },

    info: {
      container: "border-blue-200 bg-blue-50",
      icon: "text-blue-600",
      title: "text-blue-900",
      message: "text-blue-700",
      Icon: Info,
    },
  };

  const current = variants[type] || variants.info;
  const Icon = current.Icon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 rounded-xl border p-4 ${current.container}`}
    >
      <Icon
        className={`mt-0.5 h-5 w-5 shrink-0 ${current.icon}`}
      />

      <div className="min-w-0 flex-1">
        {title && (
          <p className={`text-sm font-semibold ${current.title}`}>
            {title}
          </p>
        )}

        {message && (
          <p
            className={`text-sm leading-6 ${
              title ? "mt-1" : ""
            } ${current.message}`}
          >
            {message}
          </p>
        )}
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`shrink-0 rounded-lg p-1 transition hover:bg-black/5 ${current.icon}`}
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}