const variants = {
  green:   "bg-brand-50 text-brand-700 border border-brand-200",
  saffron: "bg-amber-50 text-amber-700 border border-amber-200",
  blue:    "bg-blue-50 text-blue-700 border border-blue-200",
  slate:   "bg-slate-100 text-slate-600 border border-slate-200",
  red:     "bg-red-50 text-red-600 border border-red-200",
  purple:  "bg-purple-50 text-purple-700 border border-purple-200",
  indigo:  "bg-indigo-50 text-indigo-700 border border-indigo-200",
  rose:    "bg-rose-50 text-rose-700 border border-rose-200",
};

const sizes = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-2 py-0.5",
  lg: "text-sm px-2.5 py-1",
};

export const Badge = ({ children, variant = "green", size = "md", className = "" }) => (
  <span className={`inline-flex items-center gap-1 rounded-full font-medium font-body ${variants[variant]} ${sizes[size]} ${className}`}>
    {children}
  </span>
);
