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
          <a
            href="https://wa.me/911234567890"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp Support"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-xl text-xs font-medium text-green-700 hover:bg-green-100 transition-colors font-body"
          >
            <span>💬</span> WhatsApp
          </a>
          <button
            onClick={() => navigate("/vendor/login")}
            className="text-xs text-slate-500 hover:text-brand-700 font-body font-medium transition-colors cursor-pointer px-2 py-1"
          >
            Vendor →
          </button>
        </div>
      </div>
    </header>
  );
};
