import { useState, useMemo } from "react";
import { useCurrency } from "../../context/CurrencyContext";
import { formatPrice } from "../../utils/currency";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Select } from "../ui/Input";

// Logical room order: cheapest → most expensive
const ROOM_ORDER = ["General Ward", "Semi-Private", "Private", "Suite"];

// Shown when hospital.image is null/undefined/broken
const FALLBACK_IMAGE = "https://placehold.co/72x72/dcfce7/15803d?text=🏥";

const sortRooms = (rooms) =>
  [...rooms].sort((a, b) => ROOM_ORDER.indexOf(a) - ROOM_ORDER.indexOf(b));

export const HospitalCard = ({ hospital, onBookNow, style }) => {
  const { currency } = useCurrency();

  const defaultDoctor = hospital.doctors[0];
  const [selectedDoctorId, setSelectedDoctorId] = useState(defaultDoctor?._id || "");
  const [imgError, setImgError] = useState(false);

  const selectedDoctor = useMemo(
    () => hospital.doctors.find((d) => d._id === selectedDoctorId) || defaultDoctor,
    [selectedDoctorId, hospital.doctors, defaultDoctor]
  );

  const availableRooms = useMemo(
    () => sortRooms(Object.keys(selectedDoctor?.pricing || {})),
    [selectedDoctor]
  );

  const [selectedRoom, setSelectedRoom] = useState(() => availableRooms[0] || "");

  const handleDoctorChange = (doctorId) => {
    setSelectedDoctorId(doctorId);
    const doc = hospital.doctors.find((d) => d._id === doctorId);
    const rooms = sortRooms(Object.keys(doc?.pricing || {}));
    setSelectedRoom(rooms[0] || "");
  };

  const currentPriceUSD = selectedDoctor?.pricing?.[selectedRoom] ?? hospital.lowestPrice;

  const imgSrc = (!imgError && hospital.image) ? hospital.image : FALLBACK_IMAGE;

  const accredLabel   = hospital.accreditation || "Accredited Facility";
  const accredVariant = hospital.accreditation ? "green" : "slate";

  return (
    <div
      style={style}
      className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden flex flex-col border border-slate-100"
    >
      {/* Top accent strip */}
      <div className="h-1 bg-gradient-to-r from-brand-500 to-brand-300 flex-shrink-0" />

      <div className="p-5 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex gap-4 items-start">
          <div className="w-[72px] h-[72px] flex-shrink-0 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
            <img
              src={imgSrc}
              alt={hospital.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-slate-900 text-base leading-tight line-clamp-2">
              {hospital.name}
            </h3>
            <p className="text-slate-500 text-xs font-body mt-1 flex items-center gap-1">
              <span>📍</span> {hospital.location}
            </p>
            <p className="text-slate-600 text-xs font-body mt-0.5 truncate">{hospital.procedure}</p>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant={accredVariant}>✓ {accredLabel}</Badge>
          <Badge variant="saffron">🛡 Free Visa</Badge>
          <Badge variant="purple">💬 24/7 Support</Badge>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Doctor selector */}
        <Select
          label="Select Doctor"
          value={selectedDoctorId}
          onChange={(e) => handleDoctorChange(e.target.value)}
        >
          {hospital.doctors.map((doc) => (
            <option key={doc._id} value={doc._id}>
              {doc.name} — {doc.experience} yrs exp
            </option>
          ))}
        </Select>

        {/* Room selector */}
        <Select
          label="Room Type"
          value={selectedRoom}
          onChange={(e) => setSelectedRoom(e.target.value)}
        >
          {availableRooms.map((room) => (
            <option key={room} value={room}>
              {room} — {formatPrice(selectedDoctor?.pricing?.[room], currency)}
            </option>
          ))}
        </Select>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-1 mt-auto gap-3">
          <div className="min-w-0">
            <p className="text-xs text-slate-400 font-body">Estimated cost</p>
            <p className="text-xl font-display font-bold text-brand-700 leading-tight">
              {formatPrice(currentPriceUSD, currency)}
            </p>
            {currency !== "USD" && (
              <p className="text-xs text-slate-400 font-body">
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
                doctor: selectedDoctor,
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
            <span className="font-semibold">Book Now, Pay Later</span> — No upfront payment
            needed. Confirm your slot today and pay after arrival.
          </p>
        </div>
      </div>
    </div>
  );
};
