import { Spinner } from "./Spinner";

const variants = {
  primary:   "bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-sm hover:shadow-md",
  secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300",
  ghost:     "text-brand-700 hover:bg-brand-50",
  danger:    "bg-red-600 hover:bg-red-700 text-white",
  saffron:   "bg-saffron-500 hover:bg-saffron-600 text-white shadow-sm hover:shadow-md",
  outline:   "bg-transparent text-brand-700 border border-brand-600 hover:bg-brand-50",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-base",
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  type = "button",
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={`
      inline-flex items-center justify-center gap-2 rounded-xl font-medium font-body
      transition-all duration-200 cursor-pointer
      disabled:opacity-50 disabled:cursor-not-allowed
      focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2
      ${variants[variant]} ${sizes[size]} ${className}
    `}
    {...props}
  >
    {loading && <Spinner size="sm" color={variant === "secondary" || variant === "outline" ? "slate" : "white"} />}
    {children}
  </button>
);
