import { Link, useNavigate } from "react-router-dom";
import { CurrencyToggle } from "./ui/CurrencyToggle";

export const Navbar = ({ showCurrency = true }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-white text-base font-bold font-display">R</span>
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-display font-bold text-slate-900 text-lg">Rogveda</span>
            <span className="text-[10px] text-slate-400 font-body -mt-0.5">Medical Travel · India</span>
          </div>
          <span className="sm:hidden font-display font-bold text-slate-900 text-lg">Rogveda</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {showCurrency && <CurrencyToggle />}
          <button
  onClick={() => navigate("/vendor/login")}
  className="group inline-flex items-center gap-1 text-xs font-body font-medium text-slate-500 hover:text-brand-700 transition-colors px-2 py-1 rounded-md hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
  aria-label="Go to vendor login"
>
  Vendor
  <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
    →
  </span>
</button>
        </div>
      </div>
    </header>
  );
};
