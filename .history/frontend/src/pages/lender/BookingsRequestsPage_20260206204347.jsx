// src/pages/lender/BookingsRequestsPage.jsx
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  DollarSign,
  User,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";
import bookingService from "../../services/bookingService";
import { toast } from "sonner";

export default function BookingsRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadBookingRequests();
  }, []);

  const loadBookingRequests = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getLenderBookingRequests({
        status: "pending",
      });
      setRequests(response.bookings || response || []);
    } catch (error) {
      toast.error(error.message || "Failed to load booking requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const action = newStatus === "confirmed" ? "approve" : "reject";

    if (
      !window.confirm(
        `Are you sure you want to ${action} this booking request?`,
      )
    ) {
      return;
    }

    try {
      setProcessingId(bookingId);

      await bookingService.updateBookingStatus(bookingId, {
        status: newStatus,
      });

      toast.success(`Booking ${action}d successfully!`);

      // Remove from list
      setRequests((prev) => prev.filter((req) => req._id !== bookingId));
    } catch (error) {
      toast.error(error.message || `Failed to ${action} booking`);
    } finally {
      setProcessingId(null);
    }
  };

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
                Booking Requests
              </h1>
              <p className="text-gray-400 mt-1">
                Review and respond to pending rental requests
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {requests.length === 0 ? (
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-16 text-center">
            <AlertCircle className="h-16 w-16 text-amber-600/70 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">
              No pending booking requests
            </h3>
            <p className="text-gray-400 max-w-lg mx-auto mb-8">
              When someone requests to rent one of your items, their booking
              will appear here for approval or rejection.
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
            {requests.map((booking) => (
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
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {booking.itemId?.title || "Item no longer available"}
                        </h3>
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-amber-900/50 text-amber-300 rounded-full text-sm font-medium border border-amber-800/50">
                            <AlertCircle size={16} />
                            Pending Approval
                          </span>
                          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gray-800 text-gray-300 rounded-full text-sm font-medium">
                            {booking.itemId?.condition || "Unknown condition"}
                          </span>
                        </div>
                      </div>

                      {/* Borrower & Dates */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                          <User className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-400">Borrower</p>
                            <p className="font-medium text-gray-200">
                              {booking.borrowerId
                                ? `${booking.borrowerId.firstName} ${booking.borrowerId.lastName}`
                                : "User"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-400">
                              Rental Period
                            </p>
                            <p className="font-medium text-gray-200">
                              {format(
                                new Date(booking.startDate),
                                "MMM d, yyyy",
                              )}{" "}
                              –{" "}
                              {format(new Date(booking.endDate), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-400">Duration</p>
                            <p className="font-medium text-gray-200">
                              {booking.totalDays} day
                              {booking.totalDays !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Pricing */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                        <div className="bg-gray-950/50 p-5 rounded-xl border border-gray-800">
                          <p className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                            <DollarSign size={16} className="text-amber-500" />
                            Total Rental Amount
                          </p>
                          <p className="text-2xl font-bold text-white">
                            ${booking.totalAmount?.toFixed(2) || "—"}
                          </p>
                        </div>

                        <div className="bg-gray-950/50 p-5 rounded-xl border border-gray-800">
                          <p className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                            <Shield size={16} className="text-amber-500" />
                            Security Deposit
                          </p>
                          <p className="text-2xl font-bold text-amber-400">
                            ${booking.depositAmount?.toFixed(2) || "—"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-center lg:items-end gap-5 lg:min-w-[220px] pt-4 lg:pt-0">
                      <div className="w-full lg:w-auto">
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "confirmed")
                          }
                          disabled={processingId === booking._id}
                          className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-800 hover:bg-emerald-700 text-white font-medium rounded-xl transition disabled:opacity-50 shadow-lg shadow-emerald-900/30"
                        >
                          <CheckCircle size={18} />
                          Approve
                        </button>
                      </div>

                      <div className="w-full lg:w-auto">
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "cancelled")
                          }
                          disabled={processingId === booking._id}
                          className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-rose-900/80 hover:bg-rose-900 text-white font-medium rounded-xl transition disabled:opacity-50 border border-rose-800/50"
                        >
                          <XCircle size={18} />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
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
