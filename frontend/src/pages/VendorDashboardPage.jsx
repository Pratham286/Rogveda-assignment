import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useVendorAuth } from "../context/VendorAuthContext";
import { getVendorBookings, getBookingDetails, completeTask } from "../api/vendor";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Spinner } from "../components/ui/Spinner";
import { Modal } from "../components/ui/Modal";
import { useToast } from "../components/ui/Toast";

const STATUS_BADGE = {
  Confirmed: { variant: "saffron", label: "Confirmed" },
  "In Progress": { variant: "blue", label: "In Progress" },
  Completed: { variant: "green", label: "Completed" },
};

const TASK_BADGE = {
  pending: { variant: "slate", label: "Pending" },
  complete: { variant: "green", label: "Complete" },
};

function BookingDetailModal({ bookingId, open, onClose, onTaskComplete }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState("");
  const { addToast } = useToast();

  useEffect(() => {
    if (!open || !bookingId) return;
    setLoading(true);
    setError("");
    setDetail(null);
    getBookingDetails(bookingId)
      .then(setDetail)
      .catch((e) => setError(e.message || "Failed to load booking details."))
      .finally(() => setLoading(false));
  }, [open, bookingId]);

  const handleCompleteTask = async () => {
    if (!detail?.task?._id) return;
    setCompleting(true);
    try {
      const result = await completeTask(detail.task._id);
      setDetail((prev) => ({
        ...prev,
        task: result.task,
        status: result.booking.status,
      }));
      addToast("Task marked complete! Booking is now In Progress.", "success");
      onTaskComplete();
    } catch (e) {
      addToast(e.message || "Failed to complete task.", "error");
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-lg">
      {/* Modal inner: full-height on mobile, scrollable */}
      <div className="p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg sm:text-xl font-semibold text-slate-900">
            Booking Details
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" color="brand" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-600 font-body">
            {error}
          </div>
        )}

        {detail && !loading && (
          <div className="space-y-5">
            {/* Status + booking ID */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <p className="font-mono text-xs text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 truncate max-w-[60%] min-w-0">
                {detail._id}
              </p>
              <Badge variant={STATUS_BADGE[detail.status]?.variant || "slate"}>
                {detail.status}
              </Badge>
            </div>

            {/* Patient & procedure */}
            <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-100">
              <DetailRow label="Patient Name" value={detail.patientName} />
              <DetailRow label="Hospital" value={detail.hospitalName} />
              <DetailRow label="Doctor" value={detail.doctorName} />
              <DetailRow label="Room Type" value={detail.roomType} />
              <div className="border-t border-slate-200 pt-3">
                <DetailRow
                  label="Procedure Cost"
                  value={`$${detail.priceUSD?.toLocaleString()}`}
                  highlight
                />
              </div>
            </div>

            {/* Booking date */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-body">
              <span>🕐</span>
              <span>
                Booked on{" "}
                {new Date(detail.createdAt).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>

            {/* Task card */}
            {detail.task && (
              <div
                className={`rounded-xl border p-4 ${
                  detail.task.status === "complete"
                    ? "bg-brand-50 border-brand-200"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                  <p className="text-sm font-semibold font-body text-slate-800 flex-1 min-w-0">
                    📋 Task: {detail.task.description}
                  </p>
                  <Badge variant={TASK_BADGE[detail.task.status]?.variant || "slate"}>
                    {TASK_BADGE[detail.task.status]?.label || detail.task.status}
                  </Badge>
                </div>

                {detail.task.status === "pending" && (
                  <>
                    <p className="text-xs text-amber-700 font-body mb-3">
                      Mark this task as complete once the visa invitation letter has been sent to
                      the patient.
                    </p>
                    <Button
                      size="md"
                      className="w-full min-h-[44px]"
                      loading={completing}
                      onClick={handleCompleteTask}
                    >
                      {completing ? "Updating…" : "✓ Mark as Complete"}
                    </Button>
                  </>
                )}

                {detail.task.status === "complete" && (
                  <p className="text-xs text-brand-700 font-body">
                    ✓ Completed on{" "}
                    {new Date(detail.task.updatedAt).toLocaleString("en-IN", {
                      dateStyle: "medium",
                    })}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

const DetailRow = ({ label, value, highlight }) => (
  <div className="flex items-start justify-between gap-4">
    <span className="text-sm text-slate-500 font-body flex-shrink-0">{label}</span>
    <span
      className={`text-sm text-right font-body break-words max-w-[60%] ${
        highlight ? "font-bold text-brand-700" : "text-slate-800 font-medium"
      }`}
    >
      {value}
    </span>
  </div>
);

export default function VendorDashboardPage() {
  const { vendor, logout, isLoggedIn, ready } = useVendorAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (ready && !isLoggedIn) navigate("/vendor/login");
  }, [ready, isLoggedIn, navigate]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getVendorBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      if (e.message?.includes("Unauthorized")) {
        logout();
        navigate("/vendor/login");
      } else {
        setError(e.message || "Failed to load bookings.");
      }
    } finally {
      setLoading(false);
    }
  }, [logout, navigate]);

  useEffect(() => {
    if (isLoggedIn) fetchBookings();
  }, [isLoggedIn, fetchBookings]);

  const handleLogout = () => {
    logout();
    addToast("Logged out successfully.", "info");
    navigate("/vendor/login");
  };

  const openDetail = (id) => {
    setSelectedBookingId(id);
    setModalOpen(true);
  };

  const FILTERS = ["All", "Confirmed", "In Progress", "Completed"];

  const filtered =
    statusFilter === "All" ? bookings : bookings.filter((b) => b.status === statusFilter);

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    inProgress: bookings.filter((b) => b.status === "In Progress").length,
    completed: bookings.filter((b) => b.status === "Completed").length,
  };

  if (!ready || !isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Header ── */}
      <header className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">R</span>
            </div>
            <div className="min-w-0">
              <span className="font-display font-bold text-slate-900 text-base sm:text-lg">
                Rogveda
              </span>
              <span className="hidden sm:inline text-slate-400 text-sm font-body ml-2">
                / Vendor Dashboard
              </span>
            </div>
          </div>

          {/* Right: user info + sign out */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Vendor name — hidden on very small screens */}
            <div className="hidden xs:block text-right">
              <p className="text-sm font-semibold text-slate-800 font-body leading-tight">
                {vendor?.name}
              </p>
              <p className="text-xs text-slate-400 font-body">@{vendor?.username}</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* ── Page title + refresh ── */}
        <div className="flex items-center justify-between mb-5 sm:mb-6 gap-3">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Bookings
            </h1>
            <p className="text-slate-500 text-sm font-body mt-0.5">
              Manage patient bookings and tasks
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchBookings}
            disabled={loading}
            className="flex-shrink-0"
          >
            {loading ? <Spinner size="sm" color="slate" /> : "↻ Refresh"}
          </Button>
        </div>

        {/* ── Stats grid ── */}
        {/* 2 cols on mobile → 4 cols on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {[
            { label: "Total Bookings", value: stats.total, color: "text-slate-900" },
            { label: "Confirmed", value: stats.confirmed, color: "text-amber-600" },
            { label: "In Progress", value: stats.inProgress, color: "text-blue-600" },
            { label: "Completed", value: stats.completed, color: "text-brand-600" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl border border-slate-100 shadow-card p-3 sm:p-4"
            >
              <p className={`font-display text-2xl sm:text-3xl font-bold ${s.color}`}>
                {s.value}
              </p>
              <p className="text-xs text-slate-500 font-body mt-1 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── Filter tabs ── */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-medium font-body transition-all whitespace-nowrap cursor-pointer min-h-[40px]
                ${
                  statusFilter === f
                    ? "bg-brand-600 text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-brand-200 hover:text-brand-700"
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="flex justify-center py-16">
            <Spinner size="lg" color="brand" />
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-slate-600 font-body mb-4">{error}</p>
            <Button variant="secondary" onClick={fetchBookings}>
              Retry
            </Button>
          </div>
        )}

        {/* ── Empty (no bookings at all) ── */}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="text-5xl mb-3">📋</div>
            <h3 className="font-display font-semibold text-slate-800 text-lg sm:text-xl mb-2">
              No bookings yet
            </h3>
            <p className="text-slate-500 font-body text-sm">
              Bookings from patients will appear here in real-time.
            </p>
          </div>
        )}

        {/* ── Empty (filtered) ── */}
        {!loading && !error && bookings.length > 0 && filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 font-body">
              No bookings with status "{statusFilter}".
            </p>
          </div>
        )}

        {/* ── Bookings list ── */}
        {!loading && !error && filtered.length > 0 && (
          <>
            {/* Desktop table (md+) */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Patient", "Procedure", "Doctor", "Room", "Price", "Status", "Task", ""].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide font-body whitespace-nowrap"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filtered.map((b) => (
                      <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800 text-sm font-body whitespace-nowrap">
                            {b.patientName}
                          </p>
                          <p className="text-xs text-slate-400 font-body">{b.hospitalName}</p>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 font-body whitespace-nowrap">
                          Total Knee Replacement
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 font-body whitespace-nowrap">
                          {b.doctorName}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600 font-body whitespace-nowrap">
                          {b.roomType}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-slate-800 font-body whitespace-nowrap">
                          ${b.priceUSD?.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={STATUS_BADGE[b.status]?.variant || "slate"}>
                            {b.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={TASK_BADGE[b.task?.status]?.variant || "slate"}>
                            {TASK_BADGE[b.task?.status]?.label || "—"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => openDetail(b._id)}
                            className="text-xs text-brand-600 hover:text-brand-800 font-medium font-body cursor-pointer whitespace-nowrap"
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile / tablet cards (< md) */}
            <div className="md:hidden space-y-3">
              {filtered.map((b) => (
                <div
                  key={b._id}
                  onClick={() => openDetail(b._id)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-card p-4 cursor-pointer hover:shadow-card-hover active:scale-[0.99] transition-all"
                >
                  {/* Top row: name + status */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 font-body truncate">
                        {b.patientName}
                      </p>
                      <p className="text-xs text-slate-400 font-body mt-0.5 truncate">
                        {b.hospitalName}
                      </p>
                    </div>
                    <Badge
                      variant={STATUS_BADGE[b.status]?.variant || "slate"}
                      className="flex-shrink-0"
                    >
                      {b.status}
                    </Badge>
                  </div>

                  {/* Detail grid */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-body">
                    <div className="flex gap-1">
                      <span className="text-slate-400 flex-shrink-0">Doctor:</span>
                      <span className="text-slate-700 truncate">{b.doctorName}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-slate-400 flex-shrink-0">Room:</span>
                      <span className="text-slate-700">{b.roomType}</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-slate-400 flex-shrink-0">Price:</span>
                      <span className="font-semibold text-slate-800">
                        ${b.priceUSD?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400 flex-shrink-0">Task:</span>
                      <Badge
                        variant={TASK_BADGE[b.task?.status]?.variant || "slate"}
                        className="text-xs"
                      >
                        {TASK_BADGE[b.task?.status]?.label || "—"}
                      </Badge>
                    </div>
                  </div>

                  {/* Tap affordance */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end">
                    <span className="text-xs text-brand-600 font-medium font-body">
                      View details →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Booking detail modal */}
      <BookingDetailModal
        bookingId={selectedBookingId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onTaskComplete={fetchBookings}
      />
    </div>
  );
}