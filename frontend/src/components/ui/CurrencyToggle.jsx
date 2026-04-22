import { useCurrency } from "../../context/CurrencyContext";

export const CurrencyToggle = () => {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <div
      className="flex items-center gap-0.5 bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm"
      role="group"
      aria-label="Select currency"
    >
      {currencies.map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          aria-pressed={currency === c}
          className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all duration-200 cursor-pointer
            ${currency === c
              ? "bg-brand-600 text-white shadow-sm"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
        >
          {c}
        </button>
      ))}
    </div>
  );
};
