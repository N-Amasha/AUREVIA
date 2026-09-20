import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  message = "There is currently nothing to display.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50">
        <Icon className="h-7 w-7 text-primary-700" />
      </div>

      <h3 className="mt-5 text-lg font-semibold text-stone-900">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm leading-6 text-stone-500">
        {message}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}