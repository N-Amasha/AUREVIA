export default function Badge({
  children,
  variant = "neutral",
}) {
  const variants = {
    neutral:
      "bg-stone-100 text-stone-700",

    success:
      "bg-green-100 text-green-700",

    warning:
      "bg-amber-100 text-amber-700",

    danger:
      "bg-red-100 text-red-700",

    info:
      "bg-blue-100 text-blue-700",

    primary:
      "bg-primary-100 text-primary-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant]}`}
    >
      {children}
    </span>
  );
}