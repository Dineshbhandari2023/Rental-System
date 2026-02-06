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
} from "lucide-react";
import bookingService from "../../services/bookingService";
import { toast } from "sonner";

const statusConfig = {
  pending: {
    label: "Pending",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-800",
  },
  confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "bg-blue-100 text-blue-800",
  },
  ongoing: {
    label: "Ongoing",
    icon: Truck,
    color: "bg-purple-100 text-purple-800",
  },
  completed: {
    label: "Completed",
    icon: BadgeCheck,
    color: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Cancelled",
    icon: XCircle,
    color: "bg-red-100 text-red-800",
  },
  disputed: {
    label: "Disputed",
    icon: AlertTriangle,
    color: "bg-orange-100 text-orange-800",
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
  const [actionLoading, setActionLoading] = useState({}); // { bookingId: true/false }

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getLenderBookings({
        // You can add status filter later if needed
      });
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

    // Optimistic update
    setBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b)),
    );

    setActionLoading((prev) => ({ ...prev, [bookingId]: true }));

    try {
      await bookingService.updateBookingStatus(bookingId, {
        status: newStatus,
      });
      toast.success(`Booking ${newStatus.toLowerCase()} successfully`);
    } catch (err) {
      // Revert optimistic update on error
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
    return allowedTransitions[currentStatus]?.includes(targetStatus);
  };

  const getStatusConfig = (status) =>
    statusConfig[status] || statusConfig.cancelled;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Rentals</h1>
          <p className="text-gray-600 mt-2">
            Manage bookings and update status for items you are lending
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl border p-16 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold mb-3">No rentals yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              When someone requests to rent your item and you approve it, it
              will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => {
              const status = getStatusConfig(booking.status);
              const StatusIcon = status.icon;
              const isActionLoading = actionLoading[booking._id];

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <div className="h-40 w-52 rounded-xl overflow-hidden bg-gray-100 border">
                          {booking.itemId?.images?.[0] ? (
                            <img
                              src={booking.itemId.images[0]}
                              alt={booking.itemId.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-16 w-16 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Main content */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {booking.itemId?.title || "Item"}
                            </h3>
                            <p className="text-gray-600 mt-1">
                              Booking ID:{" "}
                              {booking.transactionId || booking._id.slice(-8)}
                            </p>
                          </div>

                          <div
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold ${status.color}`}
                          >
                            <StatusIcon className="h-5 w-5" />
                            {status.label}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Borrower</p>
                              <p className="font-medium">
                                {booking.borrowerId?.firstName}{" "}
                                {booking.borrowerId?.lastName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Period</p>
                              <p className="font-medium">
                                {format(
                                  new Date(booking.startDate),
                                  "MMM d, yyyy",
                                )}{" "}
                                –{" "}
                                {format(
                                  new Date(booking.endDate),
                                  "MMM d, yyyy",
                                )}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Duration</p>
                              <p className="font-medium">
                                {booking.totalDays} days
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Total</p>
                              <p className="font-bold">
                                ${booking.totalAmount}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Deposit</p>
                              <p className="font-medium">
                                ${booking.depositAmount}
                                {booking.paymentStatus ===
                                  "deposit_refunded" && (
                                  <span className="text-green-600 text-xs ml-2">
                                    (Refunded)
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Action buttons – only for lender */}
                        {booking.status !== "completed" &&
                          booking.status !== "cancelled" &&
                          booking.status !== "disputed" && (
                            <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                              {canTransitionTo(booking.status, "confirmed") && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(booking._id, "confirmed")
                                  }
                                  disabled={isActionLoading}
                                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                  {isActionLoading && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  )}
                                  Confirm Booking
                                </button>
                              )}

                              {canTransitionTo(booking.status, "ongoing") && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(booking._id, "ongoing")
                                  }
                                  disabled={isActionLoading}
                                  className="px-5 py-2.5 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                  {isActionLoading && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  )}
                                  Mark as Ongoing
                                </button>
                              )}

                              {canTransitionTo(booking.status, "completed") && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(booking._id, "completed")
                                  }
                                  disabled={isActionLoading}
                                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                  {isActionLoading && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  )}
                                  Mark as Completed
                                </button>
                              )}

                              {canTransitionTo(booking.status, "cancelled") && (
                                <button
                                  onClick={() =>
                                    handleStatusChange(booking._id, "cancelled")
                                  }
                                  disabled={isActionLoading}
                                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                  {isActionLoading && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  )}
                                  Cancel Booking
                                </button>
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
      </div>
    </div>
  );
}
