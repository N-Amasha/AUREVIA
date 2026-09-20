export default function Card({
  children,
  className = "",
  padding = "md",
  hover = false,
}) {
  const paddingStyles = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={`
        rounded-2xl border border-stone-200 bg-white
        ${paddingStyles[padding]}
        ${hover ? "transition-all duration-200 hover:-translate-y-1 hover:shadow-lg" : "shadow-sm"}
        ${className}
      `}
    >
      {children}
    </div>
  );
}