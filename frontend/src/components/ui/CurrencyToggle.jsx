import { useCurrency } from "../../context/CurrencyContext";

export const CurrencyToggle = () => {
  const { currency, setCurrency, currencies } = useCurrency();

  return (
    <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
      {currencies.map((c) => (
        <button
          key={c}
          onClick={() => setCurrency(c)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-body transition-all duration-200 cursor-pointer
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
