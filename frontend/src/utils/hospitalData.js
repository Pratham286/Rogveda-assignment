export const ROOM_ORDER = ["General Ward", "Semi-Private", "Private", "Suite"];

export const sortRooms = (rooms) =>
  [...rooms].sort((a, b) => ROOM_ORDER.indexOf(a) - ROOM_ORDER.indexOf(b));

export const flattenToDoctorRows = (hospitals) => {
  if (!Array.isArray(hospitals)) return [];
  const rows = [];
  for (const h of hospitals) {
    if (!Array.isArray(h.doctors) || h.doctors.length === 0) continue;
    for (const d of h.doctors) {
      const pricing = d.pricing || {};
      const rooms = sortRooms(Object.keys(pricing));
      if (rooms.length === 0) continue;
      const prices = rooms.map((r) => pricing[r]).filter((p) => typeof p === "number");
      const minPrice = prices.length > 0 ? Math.min(...prices) : h.lowestPrice ?? null;
      rows.push({
        doctor: d,
        hospital: {
          _id: h._id,
          name: h.name,
          location: h.location,
          procedure: h.procedure,
          image: h.image,
          accreditation: h.accreditation,
        },
        pricing,
        rooms,
        minPrice,
      });
    }
  }
  return rows;
};

export const SORT_OPTIONS = [
  { id: "price_asc",   label: "Lowest price",  emoji: "↑" },
  { id: "price_desc",  label: "Highest price", emoji: "↓" },
  { id: "experience",  label: "Most experienced", emoji: "★" },
  { id: "hospital",    label: "Hospital (A–Z)",   emoji: "⌘" },
];

export const sortDoctorRows = (rows, sortId) => {
  const sorted = [...rows];
  switch (sortId) {
    case "price_desc":
      return sorted.sort((a, b) => (b.minPrice ?? 0) - (a.minPrice ?? 0));
    case "experience":
      return sorted.sort((a, b) => (b.doctor.experience ?? 0) - (a.doctor.experience ?? 0));
    case "hospital":
      return sorted.sort((a, b) => (a.hospital.name || "").localeCompare(b.hospital.name || ""));
    case "price_asc":
    default:
      return sorted.sort((a, b) => (a.minPrice ?? Infinity) - (b.minPrice ?? Infinity));
  }
};
