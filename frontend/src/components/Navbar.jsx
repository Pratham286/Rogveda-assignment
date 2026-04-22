import { Link, useNavigate } from "react-router-dom";
import { CurrencyToggle } from "./ui/CurrencyToggle";

export const Navbar = ({ showCurrency = true }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-brand-700 transition-colors">
            <span className="text-white text-sm font-bold font-display">R</span>
          </div>
          <span className="font-display font-bold text-slate-900 text-lg">Rogveda</span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3">
          {showCurrency && <CurrencyToggle />}
          <a
            href="https://wa.me/911234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-xl text-xs font-medium text-green-700 hover:bg-green-100 transition-colors font-body"
          >
            <span>💬</span> WhatsApp Support
          </a>
          <button
            onClick={() => navigate("/vendor/login")}
            className="text-xs text-slate-400 hover:text-slate-600 font-body transition-colors cursor-pointer"
          >
            Vendor →
          </button>
        </div>
      </div>
    </header>
  );
};
