// src/pages/lender/MyBookingsPage.jsx
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  Package,
  CheckCircle2,
  Truck,
  BadgeCheck,
  AlertTriangle,
  XCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import bookingService from "../../services/bookingService";
import { toast } from "sonner";

/* -------------------- STATUS CONFIG -------------------- */

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-amber-900/60 text-amber-300 border-amber-800/50",
    badge: "Pending Review",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "bg-blue-900/60 text-blue-300 border-blue-800/50",
    badge: "Confirmed",
  },
  ongoing: {
    label: "Ongoing",
    icon: Truck,
    color: "bg-purple-900/60 text-purple-300 border-purple-800/50",
    badge: "In Progress",
  },
  completed: {
    label: "Completed",
    icon: BadgeCheck,
    color: "bg-emerald-900/60 text-emerald-300 border-emerald-800/50",
    badge: "Completed",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-rose-900/60 text-rose-300 border-rose-800/50",
    badge: "Cancelled",
  },
  disputed: {
    label: "Disputed",
    icon: AlertTriangle,
    color: "bg-orange-900/60 text-orange-300 border-orange-800/50",
    badge: "Under Dispute",
  },
};

const allowedTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["ongoing", "cancelled"],
  ongoing: ["completed", "disputed"],
};

/* -------------------- COMPONENT -------------------- */

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  // ✅ SAME baseUrl logic as LenderDashboard
  const baseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:8000";

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getLenderBookings({});
      setBookings(response.bookings || response || []);
    } catch (error) {
      toast.error(error.message || "Failed to load your rentals");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    const booking = bookings.find((b) => b._id === bookingId);
    if (!booking) return;

    const prevStatus = booking.status;

    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b)),
    );

    setActionLoading((prev) => ({ ...prev, [bookingId]: true }));

    try {
      await bookingService.updateBookingStatus(bookingId, {
        status: newStatus,
      });
      toast.success(`Booking updated to ${newStatus}`);
    } catch (err) {
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: prevStatus } : b,
        ),
      );
      toast.error(err.message || "Failed to update booking status");
    } finally {
      setActionLoading((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const canTransitionTo = (current, target) =>
    allowedTransitions[current]?.includes(target);

  const getStatusConfig = (status) =>
    statusConfig[status] || statusConfig.cancelled;

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 text-gray-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex items-center gap-4">
          <Link
            to="/lender/dashboard"
            className="p-2 hover:bg-gray-800 rounded-full"
          >
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">My Rentals</h1>
            <p className="text-gray-400">
              Track and manage all active and past bookings
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => {
              const status = getStatusConfig(booking.status);
              const StatusIcon = status.icon;
              const isLoading = actionLoading[booking._id];

              return (
                <div
                  key={booking._id}
                  className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden"
                >
                  <div className="p-6 flex flex-col lg:flex-row gap-8">
                    {/* ✅ PRODUCT IMAGE */}
                    <div className="w-full lg:w-64 h-48 lg:h-64 rounded-xl overflow-hidden bg-gray-950 border border-gray-800">
                      {booking.itemId?.images?.[0] ? (
                        <img
                          src={`${baseUrl}${booking.itemId.images[0]}`}
                          alt={booking.itemId.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={64} className="text-gray-700" />
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 space-y-6">
                      <div className="flex justify-between flex-wrap gap-4">
                        <div>
                          <h3 className="text-2xl font-bold">
                            {booking.itemId?.title || "Item unavailable"}
                          </h3>
                          <p className="text-sm text-gray-400">
                            Booking ID:{" "}
                            {booking.transactionId || booking._id.slice(-8)}
                          </p>
                        </div>

                        <div
                          className={`flex items-center gap-2 px-5 py-2 rounded-full border ${status.color}`}
                        >
                          <StatusIcon size={18} />
                          {status.badge}
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <InfoItem
                          icon={<User size={18} />}
                          label="Borrower"
                          value={
                            booking.borrowerId
                              ? `${booking.borrowerId.firstName} ${booking.borrowerId.lastName}`
                              : "—"
                          }
                        />
                        <InfoItem
                          icon={<Calendar size={18} />}
                          label="Rental Period"
                          value={`${format(
                            new Date(booking.startDate),
                            "MMM d, yyyy",
                          )} – ${format(
                            new Date(booking.endDate),
                            "MMM d, yyyy",
                          )}`}
                        />
                        <InfoItem
                          icon={<Clock size={18} />}
                          label="Duration"
                          value={`${booking.totalDays} day(s)`}
                        />
                        <InfoItem
                          icon={<DollarSign size={18} />}
                          label="Total Amount"
                          value={`$${booking.totalAmount?.toFixed(2)}`}
                          highlight
                        />
                      </div>

                      {/* ACTIONS */}
                      {booking.status !== "completed" &&
                        booking.status !== "cancelled" &&
                        booking.status !== "disputed" && (
                          <div className="flex gap-4 pt-6 border-t border-gray-800">
                            {canTransitionTo(booking.status, "confirmed") && (
                              <ActionButton
                                label="Confirm"
                                onClick={() =>
                                  handleStatusChange(booking._id, "confirmed")
                                }
                                loading={isLoading}
                              />
                            )}
                            {canTransitionTo(booking.status, "ongoing") && (
                              <ActionButton
                                label="Mark Ongoing"
                                onClick={() =>
                                  handleStatusChange(booking._id, "ongoing")
                                }
                                loading={isLoading}
                              />
                            )}
                            {canTransitionTo(booking.status, "completed") && (
                              <ActionButton
                                label="Complete"
                                onClick={() =>
                                  handleStatusChange(booking._id, "completed")
                                }
                                loading={isLoading}
                              />
                            )}
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

/* -------------------- SMALL COMPONENTS -------------------- */

function InfoItem({ icon, label, value, highlight }) {
  return (
    <div className="flex gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className={highlight ? "text-amber-400 text-lg" : "text-gray-200"}>
          {value}
        </p>
      </div>
    </div>
  );
}

function ActionButton({ label, onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="px-6 py-3 bg-emerald-800 hover:bg-emerald-700 rounded-xl flex items-center gap-2"
    >
      {loading && <Loader2 className="animate-spin h-4 w-4" />}
      {label}
    </button>
  );
}

function LoadingSkeleton() {
  return <div className="min-h-screen bg-gray-900 animate-pulse" />;
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <Package className="mx-auto h-16 w-16 text-gray-500" />
      <h3 className="mt-4 text-lg font-medium">No rentals yet</h3>
    </div>
  );
}
