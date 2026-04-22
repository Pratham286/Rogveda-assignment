export const Spinner = ({ size = "md", color = "brand" }) => {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-4",
  };
  const colors = {
    brand: "border-brand-200 border-t-brand-600",
    white: "border-white/30 border-t-white",
    slate: "border-slate-200 border-t-slate-600",
  };
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-full animate-spin`} role="status" aria-label="Loading" />
  );
};

export const PageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" color="brand" />
      <p className="text-slate-500 text-sm font-body">Loading…</p>
    </div>
  </div>
);
