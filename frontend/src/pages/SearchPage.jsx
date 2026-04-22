import { useState, useEffect, useRef, useMemo } from "react";
import { Navbar } from "../components/Navbar";
import { DoctorCard } from "../components/hospital/DoctorCard";
import { BookingModal } from "../components/booking/BookingModal";
import { DoctorCardSkeleton } from "../components/ui/Skeleton";
import { Button } from "../components/ui/Button";
import { searchHospitals } from "../api/hospitals";
import { flattenToDoctorRows, sortDoctorRows, SORT_OPTIONS } from "../utils/hospitalData";

const TRUST_STATS = [
  { icon: "🌍", value: "12,000+", label: "International Patients" },
  { icon: "🏥", value: "50+",     label: "Accredited Hospitals" },
  { icon: "✈️", value: "80+",     label: "Countries Served" },
  { icon: "⭐", value: "4.9/5",    label: "Patient Rating" },
];

const POPULAR_SEARCHES = [
  "Total Knee Replacement in Delhi",
  "Cardiac Bypass in Mumbai",
  "Hip Replacement India",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const [bookingSelection, setBookingSelection] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState("price_asc");
  const inputRef = useRef(null);

  // Auto-search on mount
  useEffect(() => {
    handleSearch("Total Knee Replacement in Delhi");
    setQuery("Total Knee Replacement in Delhi");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async (q) => {
    const searchQuery = (q ?? query).trim();
    if (!searchQuery) {
      inputRef.current?.focus();
      return;
    }
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const data = await searchHospitals(searchQuery);
      setHospitals(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to fetch results. Please try again.");
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const openBooking = (selection) => {
    setBookingSelection(selection);
    setModalOpen(true);
  };

  const doctorRows = useMemo(() => flattenToDoctorRows(hospitals), [hospitals]);
  const sortedRows = useMemo(() => sortDoctorRows(doctorRows, sortBy), [doctorRows, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero / Search section */}
      <section className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 rounded-full px-4 py-1.5 text-xs font-medium text-brand-700 font-body mb-4">
              <span>🇮🇳</span> India's #1 Medical Travel Platform for International Patients
            </div>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-3">
              World-Class Care,<br />
              <span className="text-brand-600">Seamless Journey</span>
            </h1>
            <p className="text-slate-500 font-body text-sm sm:text-base max-w-lg mx-auto">
              Compare top doctors, get transparent pricing, and book your procedure — all in one place.
            </p>
          </div>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="flex gap-2 bg-white border-2 border-slate-200 rounded-2xl p-2 shadow-card focus-within:border-brand-400 focus-within:shadow-card-hover transition-all duration-200">
              <div className="flex items-center pl-2 text-slate-400" aria-hidden>🔍</div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. Total Knee Replacement in Delhi"
                aria-label="Search for procedures"
                className="flex-1 px-2 py-2 text-sm font-body text-slate-800 placeholder-slate-400 outline-none bg-transparent min-w-0"
              />
              <Button size="md" loading={loading} onClick={() => handleSearch()} className="flex-shrink-0">
                Search
              </Button>
            </div>

            {/* Popular searches */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              <span className="text-xs text-slate-400 font-body self-center">Popular:</span>
              {POPULAR_SEARCHES.map((s) => (
                <button
                  key={s}
                  onClick={() => { setQuery(s); handleSearch(s); }}
                  className="text-xs px-3 py-1 bg-slate-100 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 hover:border-brand-200 rounded-full text-slate-600 font-body transition-colors cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10 max-w-2xl mx-auto">
            {TRUST_STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="font-display font-bold text-slate-900 text-lg">{stat.value}</div>
                <div className="text-xs text-slate-500 font-body">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        {/* Results header + sort */}
        {searched && !loading && !error && (
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
            <div>
              <h2 className="font-display font-semibold text-slate-900 text-xl">
                {sortedRows.length > 0
                  ? `${sortedRows.length} Doctor${sortedRows.length !== 1 ? "s" : ""} Found`
                  : "No Results"}
              </h2>
              {sortedRows.length > 0 && (
                <p className="text-sm text-slate-500 font-body mt-0.5">
                  Across {hospitals.length} accredited hospital{hospitals.length !== 1 ? "s" : ""}. Prices include procedure &amp; selected room type.
                </p>
              )}
            </div>

            {sortedRows.length > 1 && (
              <div className="flex items-center gap-2">
                <label htmlFor="sortBy" className="text-xs text-slate-500 font-body flex-shrink-0">Sort by:</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm font-body bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-brand-500 cursor-pointer"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <DoctorCardSkeleton key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">⚠️</div>
            <h3 className="font-display font-semibold text-slate-800 text-xl mb-2">Something went wrong</h3>
            <p className="text-slate-500 font-body text-sm mb-6 max-w-sm mx-auto">{error}</p>
            <Button variant="secondary" onClick={() => handleSearch()}>Try Again</Button>
          </div>
        )}

        {/* Empty results */}
        {!loading && !error && searched && sortedRows.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🏥</div>
            <h3 className="font-display font-semibold text-slate-800 text-xl mb-2">No doctors found</h3>
            <p className="text-slate-500 font-body text-sm mb-6 max-w-sm mx-auto">
              We couldn't find results matching your search. Try a different procedure or location, or use one of the popular searches above.
            </p>
            <Button variant="secondary" onClick={() => { setQuery(""); inputRef.current?.focus(); }}>
              Clear Search
            </Button>
          </div>
        )}

        {/* Doctor cards grid */}
        {!loading && !error && sortedRows.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedRows.map((row, i) => (
              <DoctorCard
                key={`${row.hospital._id}-${row.doctor._id}`}
                row={row}
                onBookNow={openBooking}
                style={{ animation: `fadeUp 0.4s ease ${Math.min(i * 60, 480)}ms both` }}
              />
            ))}
          </div>
        )}

        {/* Bottom trust section */}
        {!loading && sortedRows.length > 0 && (
          <div className="mt-12 bg-white rounded-2xl border border-slate-100 shadow-card p-6">
            <h3 className="font-display font-semibold text-slate-900 text-lg mb-4 text-center">
              Why International Patients Choose Rogveda
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: "🔍", title: "Transparent Pricing", desc: "No hidden fees. The price you see is what you pay." },
                { icon: "🛂", title: "Visa Support",        desc: "We handle your visa invitation letter and travel documentation." },
                { icon: "🤝", title: "Dedicated Coordinator", desc: "A personal guide from booking to recovery." },
              ].map((item) => (
                <div key={item.title} className="flex gap-3 p-3 rounded-xl bg-slate-50">
                  <span className="text-2xl flex-shrink-0" aria-hidden>{item.icon}</span>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm font-body">{item.title}</p>
                    <p className="text-xs text-slate-500 font-body mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-white mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400 font-body">© Rogveda 2026 · All rights reserved</p>
          <div className="flex items-center gap-4 text-xs text-slate-500 font-body">
            <a href="#" className="hover:text-brand-700">Privacy</a>
            <a href="#" className="hover:text-brand-700">Terms</a>
            <a href="mailto:hello@rogveda.com" className="hover:text-brand-700">hello@rogveda.com</a>
          </div>
        </div>
      </footer>

      {/* Booking modal */}
      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        selection={bookingSelection}
      />
    </div>
  );
}
