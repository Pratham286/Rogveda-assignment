import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorAuth } from "../context/VendorAuthContext";
import { vendorLogin } from "../api/vendor";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { useToast } from "../components/ui/Toast";

export default function VendorLoginPage() {
  const navigate = useNavigate();
  const { login } = useVendorAuth();
  const { addToast } = useToast();

  const [form, setForm] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "Username is required";
    if (!form.password.trim()) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const data = await vendorLogin(form);
      login(data.vendor, data.token);
      addToast("Welcome back, " + data.vendor.name, "success");
      navigate("/vendor/dashboard");
    } catch (err) {
      setApiError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-2">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold font-display">R</span>
            </div>
            <span className="font-display font-bold text-slate-900 text-lg">Rogveda</span>
          </a>
          <span className="text-slate-300 ml-1">|</span>
          <span className="text-slate-500 text-sm font-body ml-1">Vendor Portal</span>
        </div>
      </header>

      {/* Login card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏥</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-slate-900">Vendor Login</h1>
            <p className="text-slate-500 text-sm font-body mt-1">Access your hospital dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card p-6 space-y-4">
            <Input
              label="Username"
              placeholder="apollo"
              value={form.username}
              onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
              error={errors.username}
              autoComplete="username"
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              error={errors.password}
              autoComplete="current-password"
            />

            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-body">
                {apiError}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 font-body mt-4">
            <a href="/" className="hover:text-brand-600 transition-colors">← Back to patient search</a>
          </p>
        </div>
      </div>
    </div>
  );
}
