export const Input = ({ label, error, hint, icon, className = "", ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-700 font-body">
        {label}
      </label>
    )}
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
          {icon}
        </span>
      )}
      <input
        className={`
          w-full ${icon ? "pl-10" : "px-4"} ${!icon ? "" : "pr-4"} py-2.5 rounded-xl border font-body text-sm
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
    </div>
    {error && <p className="text-xs text-red-500 font-body flex items-center gap-1"><span>⚠</span>{error}</p>}
    {hint && !error && <p className="text-xs text-slate-400 font-body">{hint}</p>}
  </div>
);

export const Select = ({ label, error, className = "", children, ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-700 font-body">{label}</label>
    )}
    <div className="relative">
      <select
        className={`
          w-full px-4 py-2.5 pr-10 rounded-xl border font-body text-sm
          bg-white text-slate-800
          transition-colors duration-150 cursor-pointer
          ${error
            ? "border-red-300 focus:border-red-500"
            : "border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          }
          outline-none appearance-none
          ${className}
        `}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
        ▾
      </span>
    </div>
    {error && <p className="text-xs text-red-500 font-body flex items-center gap-1"><span>⚠</span>{error}</p>}
  </div>
);

export const Textarea = ({ label, error, className = "", ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-slate-700 font-body">{label}</label>
    )}
    <textarea
      className={`
        w-full px-4 py-2.5 rounded-xl border font-body text-sm
        bg-white text-slate-800 placeholder-slate-400
        transition-colors duration-150 resize-none
        ${error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
          : "border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        }
        outline-none
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-xs text-red-500 font-body flex items-center gap-1"><span>⚠</span>{error}</p>}
  </div>
);
