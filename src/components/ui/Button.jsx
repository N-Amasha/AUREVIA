export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  onClick,
}) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const variants = {
    primary:
      "bg-primary-700 text-white hover:bg-primary-800 shadow-sm",

    secondary:
      "bg-gold-500 text-white hover:bg-gold-600 shadow-sm",

    outline:
      "border border-primary-700 text-primary-700 bg-transparent hover:bg-primary-50",

    ghost:
      "text-primary-700 bg-transparent hover:bg-primary-50",

    danger:
      "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
}