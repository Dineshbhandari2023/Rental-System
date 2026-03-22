// src/pages/borrower/MyBookings.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import bookingService from "../../services/bookingService";
import { Calendar, DollarSign, Package, Clock, XCircle } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/96?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getMyBookings({
        page: 1,
        limit: 20,
      });
      setBookings(data.bookings || []);
    } catch (error) {
      toast.error(error.message || "Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      await bookingService.cancelBooking(id, {
        cancellationReason: "User requested cancellation",
      });
      toast.success("Booking cancelled successfully");
      loadBookings();
    } catch (error) {
      toast.error(error.message || "Failed to cancel booking");
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: "bg-amber-900/40 text-amber-300 border-amber-700/50",
      confirmed: "bg-emerald-900/40 text-emerald-300 border-emerald-700/50",
      ongoing: "bg-blue-900/40 text-blue-300 border-blue-700/50",
      completed: "bg-gray-700/50 text-gray-300 border-gray-600",
      cancelled: "bg-red-900/40 text-red-300 border-red-700/50",
      disputed: "bg-purple-900/40 text-purple-300 border-purple-700/50",
    };

    return (
      <span
        className={`inline-flex items-center px-3.5 py-1 rounded-full text-sm font-medium border capitalize ${
          styles[status] || "bg-gray-800 text-gray-400 border-gray-700"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100 px-4 py-8 md:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-amber-900/30">
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="mt-3 text-lg text-amber-200/70 font-light tracking-wide">
            Track your current rentals and past reservations
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-44 md:h-36 bg-gray-800/30 rounded-xl animate-pulse border border-amber-900/20"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-24">
            <Package className="mx-auto h-16 w-16 md:h-20 md:w-20 text-amber-800/60 mb-6" />
            <h3 className="text-2xl md:text-3xl font-serif text-amber-200 mb-4">
              No bookings yet
            </h3>
            <p className="text-amber-300/80 mb-8 max-w-md mx-auto">
              Start exploring items in your community and make your first
              reservation
            </p>
            <Link
              to="/borrower/browse"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-amber-50 font-medium rounded-lg border border-amber-700/50 shadow-md shadow-amber-950/30 transition-all"
            >
              Browse Available Items
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/30 rounded-xl overflow-hidden shadow-lg shadow-black/30 hover:border-amber-700/50 hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-300"
              >
                <div className="p-5 md:p-6 flex flex-col md:flex-row gap-5 md:gap-6 items-start md:items-center">
                  {/* Image */}
                  <div className="w-full md:w-32 lg:w-40 flex-shrink-0">
                    <img
                      src={getImageUrl(booking.itemId?.images?.[0])}
                      alt={booking.itemId?.title || "Item"}
                      className="w-full h-40 md:h-28 lg:h-32 object-cover rounded-lg border border-amber-900/40 shadow-sm"
                    />
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold text-xl text-amber-100 truncate">
                      {booking.itemId?.title || "Item no longer available"}
                    </h3>

                    <div className="mt-3 space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-amber-300/90">
                        <Clock size={16} className="text-amber-400" />
                        <span>
                          {new Date(booking.startDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}{" "}
                          →{" "}
                          {new Date(booking.endDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-amber-300/90">
                        <DollarSign size={16} className="text-amber-400" />
                        <span className="font-medium text-amber-200">
                          ${booking.totalAmount}
                        </span>
                        <span className="text-amber-400/70">
                          ({booking.totalDays} day
                          {booking.totalDays !== 1 ? "s" : ""})
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">{getStatusBadge(booking.status)}</div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-3 md:gap-4 w-full md:w-auto md:min-w-[180px] md:items-end">
                    <Link
                      to={`/borrower/bookings/${booking._id}`}
                      className="flex-1 md:flex-none px-5 py-2.5 bg-gray-800/60 border border-amber-900/50 rounded-lg text-amber-200 hover:bg-gray-700/60 hover:border-amber-700/60 transition-colors text-center font-medium"
                    >
                      View Details
                    </Link>

                    {["pending", "confirmed"].includes(booking.status) && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="flex-1 md:flex-none px-5 py-2.5 bg-gradient-to-r from-red-900/60 to-red-800/60 border border-red-700/50 rounded-lg text-red-200 hover:from-red-800/70 hover:to-red-700/70 transition-colors flex items-center justify-center gap-2 font-medium"
                      >
                        <XCircle size={18} />
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
