export const Input = ({ label, error, className = "", ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-700 font-body">{label}</label>
    )}
    <input
      className={`
        w-full px-4 py-2.5 rounded-xl border font-body text-sm
        bg-white text-slate-800 placeholder-slate-400
        transition-colors duration-150
        ${error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
          : "border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        }
        outline-none
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-xs text-red-500 font-body">{error}</p>}
  </div>
);

export const Select = ({ label, error, className = "", children, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-700 font-body">{label}</label>
    )}
    <select
      className={`
        w-full px-4 py-2.5 rounded-xl border font-body text-sm
        bg-white text-slate-800
        transition-colors duration-150 cursor-pointer
        ${error
          ? "border-red-300 focus:border-red-500"
          : "border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        }
        outline-none appearance-none
        bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")]
        bg-[position:right_12px_center] bg-no-repeat bg-[length:20px]
        pr-10
        ${className}
      `}
      {...props}
    >
      {children}
    </select>
    {error && <p className="text-xs text-red-500 font-body">{error}</p>}
  </div>
);
