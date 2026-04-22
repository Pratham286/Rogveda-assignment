import { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Badge } from "../ui/Badge";
import { formatPrice } from "../../utils/currency";
import { useCurrency } from "../../context/CurrencyContext";
import { createPatient } from "../../api/booking";
import { createBooking } from "../../api/booking";
import { useToast } from "../ui/Toast";

const STEPS = { PATIENT: "patient", CONFIRM: "confirm", SUCCESS: "success" };

const COUNTRIES = [
  "Nigeria", "Ghana", "Kenya", "Uganda", "Tanzania", "Ethiopia", "Cameroon",
  "South Africa", "United Kingdom", "United States", "Canada", "UAE",
  "Saudi Arabia", "Bangladesh", "Pakistan", "Other",
];

export const BookingModal = ({ open, onClose, selection }) => {
  const { currency } = useCurrency();
  const { addToast } = useToast();

  const [step, setStep] = useState(STEPS.PATIENT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [patientForm, setPatientForm] = useState({
    name: "", email: "", phone: "", country: "Nigeria",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [bookingResult, setBookingResult] = useState(null);

  const handleClose = () => {
    if (step === STEPS.SUCCESS) {
      setStep(STEPS.PATIENT);
      setPatientForm({ name: "", email: "", phone: "", country: "Nigeria" });
      setBookingResult(null);
      setError("");
    }
    onClose();
  };

  const validatePatient = () => {
    const errs = {};
    if (!patientForm.name.trim()) errs.name = "Full name is required";
    if (!patientForm.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientForm.email))
      errs.email = "Enter a valid email address";
    if (!patientForm.phone.trim()) errs.phone = "Phone number is required";
    return errs;
  };

  const handlePatientSubmit = async () => {
    setError("");
    const errs = validatePatient();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    setStep(STEPS.CONFIRM);
  };

  const handleConfirmBooking = async () => {
    if (!selection) return;
    setLoading(true);
    setError("");
    try {
      // Step 1: create or find patient
      let patient;
      try {
        patient = await createPatient(patientForm);
      } catch (e) {
        throw new Error("Could not create patient profile. Please try again.");
      }

      // Step 2: create booking
      const result = await createBooking({
        patientId: patient._id,
        hospitalId: selection.hospital._id,
        doctorId: selection.doctor._id,
        roomType: selection.roomType,
      });

      setBookingResult({ ...result, patientName: patientForm.name });
      setStep(STEPS.SUCCESS);
      addToast("Booking confirmed successfully!", "success");
    } catch (e) {
      setError(e.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!selection) return null;

  return (
    <Modal open={open} onClose={handleClose} maxWidth="max-w-md">
      {/* Step: Patient Details */}
      {step === STEPS.PATIENT && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-900">Your Details</h2>
              <p className="text-sm text-slate-500 font-body mt-0.5">Quick registration to confirm your slot</p>
            </div>
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 text-xl cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100">✕</button>
          </div>

          {/* Summary pill */}
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 mb-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-brand-600 font-body font-medium">{selection.hospital.name}</p>
              <p className="text-xs text-slate-500 font-body">{selection.doctor.name} · {selection.roomType}</p>
            </div>
            <p className="font-display font-bold text-brand-700 text-lg">{formatPrice(selection.priceUSD, currency)}</p>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              placeholder="e.g. John Mensah"
              value={patientForm.name}
              onChange={(e) => setPatientForm((p) => ({ ...p, name: e.target.value }))}
              error={fieldErrors.name}
            />
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              value={patientForm.email}
              onChange={(e) => setPatientForm((p) => ({ ...p, email: e.target.value }))}
              error={fieldErrors.email}
            />
            <Input
              label="Phone Number (with country code)"
              placeholder="+234 801 234 5678"
              value={patientForm.phone}
              onChange={(e) => setPatientForm((p) => ({ ...p, phone: e.target.value }))}
              error={fieldErrors.phone}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700 font-body">Country</label>
              <select
                value={patientForm.country}
                onChange={(e) => setPatientForm((p) => ({ ...p, country: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-body text-sm bg-white text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 cursor-pointer"
              >
                {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Trust note */}
          <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 font-body">
            <span className="text-brand-500 mt-0.5">🔒</span>
            <span>Your information is encrypted and only shared with your chosen hospital.</span>
          </div>

          <Button className="w-full mt-5" size="lg" onClick={handlePatientSubmit}>
            Continue to Confirm →
          </Button>
        </div>
      )}

      {/* Step: Confirm Booking */}
      {step === STEPS.CONFIRM && (
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setStep(STEPS.PATIENT)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
              ← 
            </button>
            <div>
              <h2 className="font-display text-xl font-semibold text-slate-900">Confirm Booking</h2>
              <p className="text-sm text-slate-500 font-body">Review details before confirming</p>
            </div>
          </div>

          {/* Booking summary card */}
          <div className="bg-slate-50 rounded-2xl p-4 space-y-3 mb-5 border border-slate-100">
            <Row label="Patient" value={patientForm.name} />
            <Row label="Hospital" value={selection.hospital.name} />
            <Row label="Procedure" value={selection.hospital.procedure} />
            <Row label="Doctor" value={`${selection.doctor.name} (${selection.doctor.experience} yrs exp)`} />
            <Row label="Room Type" value={selection.roomType} />
            <div className="border-t border-slate-200 pt-3">
              <Row
                label="Total Cost"
                value={formatPrice(selection.priceUSD, currency)}
                highlight
              />
            </div>
          </div>

          {/* Wallet info */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-amber-600 text-sm">💳</span>
              <p className="text-sm font-semibold text-amber-800 font-body">Wallet Balance: $0.00</p>
            </div>
            <p className="text-xs text-amber-700 font-body leading-relaxed">
              Your booking will be confirmed with <strong>zero upfront payment</strong>. Your wallet will reflect the cost — payable before your procedure date.
            </p>
          </div>

          {/* Included services */}
          <div className="mb-5 space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide font-body">Included with your booking</p>
            {["Free Visa Invitation Letter", "Airport pickup coordination", "Dedicated care coordinator", "24/7 WhatsApp support"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-700 font-body">
                <span className="text-brand-500 text-xs">✓</span> {item}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-600 font-body">
              {error}
            </div>
          )}

          <Button className="w-full" size="lg" loading={loading} onClick={handleConfirmBooking}>
            {loading ? "Confirming…" : "Confirm Booking"}
          </Button>
          <p className="text-center text-xs text-slate-400 font-body mt-3">
            By confirming, you agree to Rogveda's terms and cancellation policy.
          </p>
        </div>
      )}

      {/* Step: Success */}
      {step === STEPS.SUCCESS && bookingResult && (
        <div className="p-6 text-center">
          {/* Success icon */}
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-fade-in">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mb-1">Booking Confirmed!</h2>
          <p className="text-slate-500 font-body text-sm mb-6">
            We've reserved your slot. Your care coordinator will reach out within 24 hours.
          </p>

          {/* Booking ID */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 text-left space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-body uppercase tracking-wide">Booking ID</p>
              <Badge variant="green">Confirmed</Badge>
            </div>
            <p className="font-mono text-sm text-slate-700 bg-white border border-slate-200 rounded-lg px-3 py-2 break-all">
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

          {/* Wallet balance */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs text-amber-700 font-body font-semibold">Wallet Balance</p>
              <p className="text-xs text-amber-600 font-body">Payable before procedure</p>
            </div>
            <p className="font-display font-bold text-amber-800 text-lg">
              ${bookingResult.walletBalance?.toLocaleString()}
            </p>
          </div>

          {/* Next steps */}
          <div className="bg-brand-50 border border-brand-100 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-semibold text-brand-800 font-body mb-2">What happens next?</p>
            {[
              "Visa Invitation Letter will be sent to your email within 48 hours",
              "Our coordinator will WhatsApp you to plan your travel",
              "Hospital will confirm your surgery date",
            ].map((step, i) => (
              <div key={i} className="flex gap-2 text-xs text-brand-700 font-body mb-1">
                <span className="font-bold flex-shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <Button className="w-full" size="lg" onClick={handleClose}>
            Done
          </Button>
        </div>
      )}
    </Modal>
  );
};

const Row = ({ label, value, highlight }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-sm text-slate-500 font-body flex-shrink-0">{label}</span>
    <span className={`text-sm font-body text-right ${highlight ? "font-bold text-brand-700 font-display text-base" : "text-slate-800 font-medium"}`}>
      {value}
    </span>
  </div>
);
