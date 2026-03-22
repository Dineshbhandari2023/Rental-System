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
  // completed, cancelled, disputed → no further actions
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

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

    // Optimistic UI update
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
      // Rollback on error
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

  const canTransitionTo = (currentStatus, targetStatus) => {
    return allowedTransitions[currentStatus]?.includes(targetStatus) ?? false;
  };

  const getStatusConfig = (status) =>
    statusConfig[status] || statusConfig.cancelled;

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 text-gray-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-4">
            <Link
              to="/lender/dashboard"
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-300" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                My Rentals
              </h1>
              <p className="text-gray-400 mt-1">
                Track and manage all active and past bookings
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {bookings.length === 0 ? (
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-16 text-center">
            <Package className="h-16 w-16 text-amber-600/70 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">
              No rentals yet
            </h3>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              Once you approve a booking request or a rental begins, it will
              appear here.
            </p>
            <Link
              to="/lender/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-medium transition shadow-lg shadow-amber-900/30"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => {
              const status = getStatusConfig(booking.status);
              const StatusIcon = status.icon;
              const isLoading = actionLoading[booking._id];

              return (
                <div
                  key={booking._id}
                  className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden shadow-xl hover:border-amber-800/50 transition-all duration-300"
                >
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Item Image */}
                      <div className="flex-shrink-0">
                        <div className="w-full lg:w-64 h-48 lg:h-64 rounded-xl overflow-hidden bg-gray-950 border border-gray-800 relative group">
                          {booking.itemId?.images?.[0] ? (
                            <img
                              src={booking.itemId.images[0]}
                              alt={booking.itemId.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={64} className="text-gray-700" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Main Content */}
                      <div className="flex-1 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div>
                            <h3 className="text-2xl font-bold text-white mb-1">
                              {booking.itemId?.title || "Item unavailable"}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              Booking ID:{" "}
                              {booking.transactionId || booking._id.slice(-8)}
                            </p>
                          </div>

                          <div
                            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium backdrop-blur-sm border ${status.color}`}
                          >
                            <StatusIcon size={18} />
                            {status.badge}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          <InfoItem
                            icon={<User size={18} className="text-amber-500" />}
                            label="Borrower"
                            value={
                              booking.borrowerId
                                ? `${booking.borrowerId.firstName} ${booking.borrowerId.lastName}`
                                : "—"
                            }
                          />

                          <InfoItem
                            icon={
                              <Calendar size={18} className="text-amber-500" />
                            }
                            label="Rental Period"
                            value={`${format(new Date(booking.startDate), "MMM d, yyyy")} – ${format(
                              new Date(booking.endDate),
                              "MMM d, yyyy",
                            )}`}
                          />

                          <InfoItem
                            icon={
                              <Clock size={18} className="text-amber-500" />
                            }
                            label="Duration"
                            value={`${booking.totalDays} day${booking.totalDays !== 1 ? "s" : ""}`}
                          />

                          <InfoItem
                            icon={
                              <DollarSign
                                size={18}
                                className="text-amber-500"
                              />
                            }
                            label="Total Amount"
                            value={`$${booking.totalAmount?.toFixed(2) || "—"}`}
                            highlight
                          />

                          <InfoItem
                            icon={
                              <DollarSign
                                size={18}
                                className="text-amber-500"
                              />
                            }
                            label="Deposit"
                            value={
                              <>
                                ${booking.depositAmount?.toFixed(2) || "—"}
                                {booking.paymentStatus ===
                                  "deposit_refunded" && (
                                  <span className="text-emerald-400 text-xs ml-2">
                                    (Refunded)
                                  </span>
                                )}
                              </>
                            }
                          />
                        </div>

                        {/* Action Buttons */}
                        {booking.status !== "completed" &&
                          booking.status !== "cancelled" &&
                          booking.status !== "disputed" && (
                            <div className="flex flex-wrap gap-4 pt-6 mt-4 border-t border-gray-800">
                              {canTransitionTo(booking.status, "confirmed") && (
                                <ActionButton
                                  label="Confirm"
                                  onClick={() =>
                                    handleStatusChange(booking._id, "confirmed")
                                  }
                                  color="emerald"
                                  loading={isLoading}
                                />
                              )}

                              {canTransitionTo(booking.status, "ongoing") && (
                                <ActionButton
                                  label="Mark as Ongoing"
                                  onClick={() =>
                                    handleStatusChange(booking._id, "ongoing")
                                  }
                                  color="purple"
                                  loading={isLoading}
                                />
                              )}

                              {canTransitionTo(booking.status, "completed") && (
                                <ActionButton
                                  label="Mark as Completed"
                                  onClick={() =>
                                    handleStatusChange(booking._id, "completed")
                                  }
                                  color="emerald"
                                  loading={isLoading}
                                />
                              )}

                              {canTransitionTo(booking.status, "cancelled") && (
                                <ActionButton
                                  label="Cancel Booking"
                                  onClick={() =>
                                    handleStatusChange(booking._id, "cancelled")
                                  }
                                  color="rose"
                                  loading={isLoading}
                                  variant="outline"
                                />
                              )}
                            </div>
                          )}
                      </div>
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

// Reusable small components

function InfoItem({ icon, label, value, highlight = false }) {
  return (
    <div className="flex items-start gap-3">
      {icon}
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p
          className={`font-medium ${highlight ? "text-amber-400 text-lg" : "text-gray-200"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function ActionButton({ label, onClick, color, loading, variant = "solid" }) {
  const base =
    "flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50 shadow-md min-w-[160px]";

  const variants = {
    solid: {
      emerald:
        "bg-emerald-800 hover:bg-emerald-700 text-white shadow-emerald-900/30",
      purple:
        "bg-purple-800 hover:bg-purple-700 text-white shadow-purple-900/30",
      rose: "bg-rose-900 hover:bg-rose-800 text-white shadow-rose-900/30",
    },
    outline: {
      rose: "bg-transparent border border-rose-800/60 text-rose-300 hover:bg-rose-950/60",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`${base} ${variants[variant][color] || variants.solid[color]}`}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {label}
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse space-y-10">
        <div className="h-12 bg-gray-800/60 rounded-xl w-1/3" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-900/70 border border-gray-800 rounded-2xl p-8 h-80"
          />
        ))}
      </div>
    </div>
  );
}
