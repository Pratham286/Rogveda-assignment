import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input, Select } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { formatPrice } from "../../utils/currency";
import { useCurrency } from "../../context/CurrencyContext";
import { createPatient, createBooking } from "../../api/booking";
import { useToast } from "../ui/Toast";

const STEPS = { PATIENT: "patient", CONFIRM: "confirm", SUCCESS: "success" };
const STEP_ORDER = [STEPS.PATIENT, STEPS.CONFIRM, STEPS.SUCCESS];

const COUNTRIES = [
  { label: "Nigeria", value: "Nigeria" },
  { label: "United States", value: "United States" },
  { label: "India", value: "India" },
  { label: "Other", value: "Other" },
];

const DIAL_CODES = [
  { label: "🇳🇬 +234", value: "+234", country: "Nigeria", minDigits: 10, maxDigits: 10 },
  { label: "🇺🇸 +1",   value: "+1",   country: "United States", minDigits: 10, maxDigits: 10 },
  { label: "🇮🇳 +91",  value: "+91",  country: "India", minDigits: 10, maxDigits: 10 },
  { label: "🌐 Other", value: "other", country: "Other", minDigits: 6,  maxDigits: 15 },
];

// ── Validators ──────────────────────────────────────────────────────────────

const isValidEmail = (e) =>
  /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(e.trim());

// Requires at least two words (first + last name)
const isValidFullName = (n) => {
  const parts = n.trim().split(/\s+/);
  return parts.length >= 2 && parts.every((p) => p.length >= 1);
};

// Local number only — strip spaces/dashes/parens then check digit count
const isValidLocalPhone = (local, dialCode) => {
  const digits = local.replace(/[\s\-().]/g, "");
  if (!/^\d+$/.test(digits)) return false;
  const rule = DIAL_CODES.find((d) => d.value === dialCode);
  if (!rule) return digits.length >= 6 && digits.length <= 15;
  return digits.length >= rule.minDigits && digits.length <= rule.maxDigits;
};

const validatePatient = (form) => {
  const errs = {};
  if (!form.name.trim()) {
    errs.name = "Full name is required";
  } else if (!isValidFullName(form.name)) {
    errs.name = "Please enter your first and last name";
  }
  if (!form.email.trim()) {
    errs.email = "Email is required";
  } else if (!isValidEmail(form.email)) {
    errs.email = "Enter a valid email address (e.g. john@example.com)";
  }
  if (!form.phone.trim()) {
    errs.phone = "Phone number is required";
  } else if (!isValidLocalPhone(form.phone, form.dialCode)) {
    const rule = DIAL_CODES.find((d) => d.value === form.dialCode);
    const expected = rule && rule.minDigits === rule.maxDigits
      ? `${rule.minDigits} digits`
      : `${rule?.minDigits}–${rule?.maxDigits} digits`;
    errs.phone = `Enter a valid local number (${expected}, no country code)`;
  }
  return errs;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const formatApiError = (err) => {
  if (!navigator.onLine) return "No internet connection. Please check your network and try again.";
  if (err?.status === 409) return "An account with this email already exists. Try a different email.";
  if (err?.status === 422) return "Some details are invalid. Please go back and check your information.";
  if (err?.status >= 500) return "Our servers are having trouble. Please try again in a moment.";
  return err?.message || "Something went wrong. Please try again.";
};

// ── Sub-components ────────────────────────────────────────────────────────────

const StepProgress = ({ current }) => {
  const idx = STEP_ORDER.indexOf(current);
  return (
    <div className="flex items-center gap-2 mb-4">
      {STEP_ORDER.map((s, i) => (
        <div key={s} className="flex items-center flex-1">
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
              i <= idx ? "bg-brand-500" : "bg-slate-200"
            }`}
          />
          {i < STEP_ORDER.length - 1 && <div className="w-1" />}
        </div>
      ))}
    </div>
  );
};

const ErrorBanner = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-700 font-body flex items-start gap-2">
    <span className="flex-shrink-0 mt-0.5">⚠</span>
    <div className="flex-1">
      <span>{message}</span>
      {onRetry && (
        <button
          onClick={onRetry}
          className="block mt-1 text-xs font-semibold text-red-600 underline underline-offset-2 hover:text-red-800"
        >
          Try again
        </button>
      )}
    </div>
  </div>
);

const Row = ({ label, value, highlight }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-sm text-slate-500 font-body flex-shrink-0">{label}</span>
    <span
      className={`text-sm font-body text-right break-words ${
        highlight
          ? "font-bold text-brand-700 font-display text-base"
          : "text-slate-800 font-medium"
      }`}
    >
      {value}
    </span>
  </div>
);

// ── PhoneField ────────────────────────────────────────────────────────────────

const PhoneField = ({ dialCode, phone, onDialChange, onPhoneChange, error }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 font-body mb-1">
      Phone Number
    </label>
    <div className={`flex rounded-xl border transition-colors ${error ? "border-red-400" : "border-slate-200 focus-within:border-brand-400"}`}>
      <select
        value={dialCode}
        onChange={(e) => onDialChange(e.target.value)}
        className="bg-slate-50 text-sm text-slate-700 font-body rounded-l-xl border-r border-slate-200 px-2 py-2.5 focus:outline-none focus:bg-brand-50 transition-colors cursor-pointer"
        aria-label="Country dial code"
      >
        {DIAL_CODES.map((d) => (
          <option key={d.value} value={d.value}>{d.label}</option>
        ))}
      </select>
      <input
        type="tel"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        placeholder="801 234 5678"
        autoComplete="tel-local"
        className="flex-1 bg-white text-sm text-slate-800 font-body px-3 py-2.5 rounded-r-xl focus:outline-none min-w-0"
        aria-describedby={error ? "phone-error" : undefined}
      />
    </div>
    <p className="text-[11px] text-slate-400 font-body mt-1">Local number only — no country code needed</p>
    {error && (
      <p id="phone-error" className="text-xs text-red-500 font-body mt-1">{error}</p>
    )}
  </div>
);

// ── BookingModal ──────────────────────────────────────────────────────────────

export const BookingModal = ({ open, onClose, selection }) => {
  const { currency } = useCurrency();
  const { addToast } = useToast();

  const [step, setStep] = useState(STEPS.PATIENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientForm, setPatientForm] = useState({
    name: "", email: "", phone: "", dialCode: "+234", country: "Nigeria",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [bookingResult, setBookingResult] = useState(null);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setStep(STEPS.PATIENT);
        setPatientForm({ name: "", email: "", phone: "", dialCode: "+234", country: "Nigeria" });
        setBookingResult(null);
        setError("");
        setFieldErrors({});
      }, 300);
      return () => clearTimeout(t);
    }
  }, [open]);

  // Sync dial code when country changes
  const handleCountryChange = (country) => {
    const match = DIAL_CODES.find((d) => d.country === country);
    setPatientForm((p) => ({
      ...p,
      country,
      dialCode: match ? match.value : "other",
      phone: "", // reset phone on country change to avoid stale validation
    }));
    setFieldErrors((e) => ({ ...e, phone: undefined }));
  };

  const clearFieldError = (field) =>
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  const handlePatientSubmit = () => {
    setError("");
    const errs = validatePatient(patientForm);
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setStep(STEPS.CONFIRM);
  };

  const handleConfirmBooking = async () => {
    if (!selection) return;
    setLoading(true);
    setError("");
    try {
      let patient;
      try {
        patient = await createPatient({
          ...patientForm,
          // Combine for storage: "+234" + "8012345678"
          phone: `${patientForm.dialCode} ${patientForm.phone.trim()}`,
        });
      } catch (e) {
        const msg = formatApiError(e);
        // If it looks like a patient-data issue, send back to step 1
        if (e?.status === 409 || e?.status === 422) {
          setStep(STEPS.PATIENT);
          setError(msg);
        } else {
          throw new Error(msg);
        }
        return;
      }

      const result = await createBooking({
        patientId: patient._id,
        hospitalId: selection.hospital._id,
        doctorId: selection.doctor._id,
        roomType: selection.roomType,
      });

      setBookingResult({ ...result, patientName: patientForm.name });
      setStep(STEPS.SUCCESS);
      addToast("Booking confirmed! Check your email.", "success");
    } catch (e) {
      setError(formatApiError(e));
    } finally {
      setLoading(false);
    }
  };

  if (!selection) return null;

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-md">
      {/* ── STEP 1: Patient Details ── */}
      {step === STEPS.PATIENT && (
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide font-semibold text-brand-600 font-body">Step 1 of 3</p>
              <h2 className="font-display text-xl font-semibold text-slate-900">Your Details</h2>
              <p className="text-sm text-slate-500 font-body mt-0.5">Quick registration to confirm your slot</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 flex-shrink-0"
              aria-label="Close"
            >✕</button>
          </div>

          <StepProgress current={step} />

          <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 mb-5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-brand-700 font-body font-semibold line-clamp-1">{selection.doctor.name}</p>
              <p className="text-[11px] text-slate-500 font-body line-clamp-1">{selection.hospital.name} · {selection.roomType}</p>
            </div>
            <p className="font-display font-bold text-brand-700 text-lg flex-shrink-0">{formatPrice(selection.priceUSD, currency)}</p>
          </div>

          {error && <ErrorBanner message={error} />}

          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. John Mensah"
              value={patientForm.name}
              onChange={(e) => { setPatientForm((p) => ({ ...p, name: e.target.value })); clearFieldError("name"); }}
              error={fieldErrors.name}
              autoComplete="name"
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={patientForm.email}
              onChange={(e) => { setPatientForm((p) => ({ ...p, email: e.target.value })); clearFieldError("email"); }}
              error={fieldErrors.email}
              autoComplete="email"
            />
            <PhoneField
              dialCode={patientForm.dialCode}
              phone={patientForm.phone}
              onDialChange={(val) => {
                setPatientForm((p) => ({ ...p, dialCode: val, phone: "" }));
                clearFieldError("phone");
              }}
              onPhoneChange={(val) => { setPatientForm((p) => ({ ...p, phone: val })); clearFieldError("phone"); }}
              error={fieldErrors.phone}
            />
            <Select
              label="Country"
              value={patientForm.country}
              onChange={(e) => handleCountryChange(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </Select>
          </div>

          <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 font-body">
            <span className="text-brand-500 mt-0.5 flex-shrink-0">🔒</span>
            <span>Your information is encrypted and only shared with your chosen hospital.</span>
          </div>

          <Button className="w-full mt-5" size="lg" onClick={handlePatientSubmit}>
            Continue →
          </Button>
        </div>
      )}

      {/* ── STEP 2: Confirm ── */}
      {step === STEPS.CONFIRM && (
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <button
                onClick={() => { setStep(STEPS.PATIENT); setError(""); }}
                className="text-slate-400 hover:text-slate-700 cursor-pointer mt-1 w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100"
                aria-label="Back"
              >←</button>
              <div>
                <p className="text-[10px] uppercase tracking-wide font-semibold text-brand-600 font-body">Step 2 of 3</p>
                <h2 className="font-display text-xl font-semibold text-slate-900">Confirm Booking</h2>
                <p className="text-sm text-slate-500 font-body mt-0.5">Review details before confirming</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 text-lg cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100"
              aria-label="Close"
            >✕</button>
          </div>

          <StepProgress current={step} />

          <div className="bg-slate-50 rounded-2xl p-4 space-y-3 mb-5 border border-slate-100">
            <Row label="Patient" value={patientForm.name} />
            <Row label="Hospital" value={selection.hospital.name} />
            <Row label="Procedure" value={selection.hospital.procedure} />
            <Row label="Doctor" value={`${selection.doctor.name} (${selection.doctor.experience} yrs)`} />
            <Row label="Room Type" value={selection.roomType} />
            <Row label="Phone" value={`${patientForm.dialCode} ${patientForm.phone}`} />
            <div className="border-t border-slate-200 pt-3">
              <Row label="Total Cost" value={formatPrice(selection.priceUSD, currency)} highlight />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-600 text-sm">💳</span>
              <p className="text-sm font-semibold text-amber-800 font-body">Pay After Arrival</p>
            </div>
            <p className="text-xs text-amber-700 font-body leading-relaxed">
              Confirm your slot with <strong>zero upfront payment</strong>. The cost will be added to your wallet and is payable before your procedure date.
            </p>
          </div>

          <div className="mb-5 space-y-2">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide font-body">Included with your booking</p>
            {[
              "Free Visa Invitation Letter (within 48 hours)",
              "Airport pickup coordination",
              "Dedicated care coordinator",
              "24/7 WhatsApp support",
              "Free cancellation up to 7 days before",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2 text-sm text-slate-700 font-body">
                <span className="text-brand-500 text-xs mt-1">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {error && <ErrorBanner message={error} onRetry={handleConfirmBooking} />}

          <Button className="w-full" size="lg" loading={loading} onClick={handleConfirmBooking} disabled={loading}>
            {loading ? "Confirming…" : "Confirm Booking"}
          </Button>
          <p className="text-center text-[11px] text-slate-400 font-body mt-3">
            By confirming, you agree to Rogveda's terms and cancellation policy.
          </p>
        </div>
      )}

      {/* ── STEP 3: Success ── */}
      {step === STEPS.SUCCESS && bookingResult && (
        <div className="p-6 text-center">
          <StepProgress current={step} />

          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in">
            <span className="text-3xl text-brand-700">✓</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Booking Confirmed!</h2>
          <p className="text-slate-500 font-body text-sm mb-6">
            Your care coordinator will reach out within 24 hours.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 text-left space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-400 font-body uppercase tracking-wide">Booking ID</p>
              <Badge variant="green">Confirmed</Badge>
            </div>
            <p className="font-mono text-xs text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 break-all">
              {bookingResult.bookingId}
            </p>
            <Row label="Patient" value={bookingResult.patientName || patientForm.name} />
            <Row label="Hospital" value={bookingResult.hospitalName} />
            <Row label="Doctor" value={bookingResult.doctorName} />
            <Row label="Room" value={bookingResult.roomType} />
            <div className="border-t border-slate-200 pt-3">
              <Row label="Amount" value={`$${bookingResult.priceUSD?.toLocaleString()}`} highlight />
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs text-amber-700 font-body font-semibold">Wallet Balance</p>
              <p className="text-[11px] text-amber-600 font-body">Payable before procedure</p>
            </div>
            <p className="font-display font-bold text-amber-800 text-lg">
              ${bookingResult.walletBalance?.toLocaleString()}
            </p>
          </div>

          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-brand-800 font-body mb-2">What happens next?</p>
            {[
              "Visa Invitation Letter will be sent to your email within 48 hours",
              "Our coordinator will WhatsApp you to plan your travel",
              "Hospital will confirm your surgery date",
            ].map((stepText, i) => (
              <div key={i} className="flex gap-2 text-xs text-brand-700 font-body mb-1">
                <span className="font-bold flex-shrink-0">{i + 1}.</span>
                <span>{stepText}</span>
              </div>
            ))}
          </div>

          <Button className="w-full" size="lg" onClick={onClose}>
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
};