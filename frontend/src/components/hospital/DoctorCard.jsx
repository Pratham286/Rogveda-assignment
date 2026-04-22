import { useState, useMemo } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import { formatPrice } from "../../utils/currency";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";

// Doctor avatar placeholder — initials-based, so we don't have to hit an image CDN
const DoctorAvatar = ({ name, photo }) => {
  const [imgError, setImgError] = useState(false);
  const initials = (name || "Dr")
    .replace(/^Dr\.?\s*/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (photo && !imgError) {
    return (
      <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-white ring-2 ring-brand-100 flex-shrink-0">
        <img
          src={photo}
          alt={name}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      </div>
    );
  }
  return (
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 border-2 border-white ring-2 ring-brand-100 flex items-center justify-center flex-shrink-0">
      <span className="text-white font-display font-bold text-lg">{initials || "Dr"}</span>
    </div>
  );
};

const RoomPill = ({ room, price, currency, selected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={`flex flex-col items-start gap-0.5 px-3 py-2 rounded-lg border text-left transition-all cursor-pointer
      ${selected
        ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100"
        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
      }`}
  >
    <span className={`text-[11px] font-medium font-body ${selected ? "text-brand-700" : "text-slate-500"}`}>
      {room}
    </span>
    <span className={`text-sm font-semibold font-body ${selected ? "text-brand-800" : "text-slate-800"}`}>
      {formatPrice(price, currency)}
    </span>
  </button>
);

export const DoctorCard = ({ row, onBookNow, style }) => {
  const { currency } = useCurrency();
  const { doctor, hospital, pricing, rooms } = row;

  const [selectedRoom, setSelectedRoom] = useState(rooms[0] || "");
  const currentPriceUSD = pricing[selectedRoom];

  // Derive a deterministic but varied "rating" from doctor experience — purely visual trust signal
  const rating = useMemo(() => {
    const base = 4.5 + ((doctor.experience || 10) % 5) * 0.1;
    return Math.min(5.0, Math.max(4.3, base)).toFixed(1);
  }, [doctor.experience]);

  const accredLabel = hospital.accreditation || "Accredited";

  return (
    <div
      style={style}
      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col border border-slate-100 h-full"
    >
      {/* Top accent strip */}
      <div className="h-1 bg-gradient-to-r from-brand-500 to-brand-300 flex-shrink-0" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Doctor header */}
        <div className="flex gap-4 items-start">
          <DoctorAvatar name={doctor.name} photo={doctor.photo} />
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-slate-900 text-base leading-tight line-clamp-1">
              {doctor.name}
            </h3>
            <p className="text-slate-600 text-xs font-body mt-0.5 flex items-center gap-1">
              <span className="text-amber-500">★</span>
              <span className="font-semibold text-slate-700">{rating}</span>
              <span className="text-slate-400">·</span>
              <span>{doctor.experience}+ yrs exp</span>
            </p>
            <p className="text-slate-700 text-xs font-body mt-1 flex items-center gap-1 line-clamp-1">
              <span className="text-brand-600">🏥</span>
              <span className="font-medium">{hospital.name}</span>
            </p>
            <p className="text-slate-500 text-[11px] font-body mt-0.5 flex items-center gap-1 line-clamp-1">
              <span>📍</span> {hospital.location}
            </p>
          </div>
        </div>

        {/* Procedure */}
        <div className="bg-slate-50 rounded-lg px-3 py-2 border border-slate-100">
          <p className="text-[10px] uppercase tracking-wide text-slate-400 font-body font-semibold">Procedure</p>
          <p className="text-sm text-slate-800 font-body mt-0.5 line-clamp-1">{hospital.procedure}</p>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="green">✓ {accredLabel}</Badge>
          <Badge variant="saffron">🛡 Free Visa</Badge>
          <Badge variant="purple">💬 24/7 Support</Badge>
        </div>

        {/* Room selector — pills, not a dropdown */}
        <div>
          <p className="text-xs font-medium text-slate-600 font-body mb-2">Select Room Type</p>
          <div className="grid grid-cols-2 gap-2">
            {rooms.map((r) => (
              <RoomPill
                key={r}
                room={r}
                price={pricing[r]}
                currency={currency}
                selected={selectedRoom === r}
                onClick={() => setSelectedRoom(r)}
              />
            ))}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-end justify-between pt-1 mt-auto gap-3">
          <div className="min-w-0">
            <p className="text-[11px] text-slate-400 font-body uppercase tracking-wide">Total cost</p>
            <p className="text-2xl font-display font-bold text-brand-700 leading-tight">
              {formatPrice(currentPriceUSD, currency)}
            </p>
            {currency !== "USD" && (
              <p className="text-[11px] text-slate-400 font-body">
                ≈ ${currentPriceUSD?.toLocaleString()} USD
              </p>
            )}
          </div>
          <Button
            size="md"
            className="flex-shrink-0"
            onClick={() =>
              onBookNow({
                hospital,
                doctor,
                roomType: selectedRoom,
                priceUSD: currentPriceUSD,
              })
            }
          >
            Book Now →
          </Button>
        </div>

        {/* BNPL note */}
        <div className="bg-brand-50 border border-brand-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
          <span className="text-brand-600 text-sm mt-0.5 flex-shrink-0">✦</span>
          <p className="text-xs text-brand-700 font-body leading-relaxed">
            <span className="font-semibold">Book Now, Pay Later</span> — No upfront payment. Confirm your slot today and pay after arrival.
          </p>
        </div>
      </div>
    </div>
  );
};
