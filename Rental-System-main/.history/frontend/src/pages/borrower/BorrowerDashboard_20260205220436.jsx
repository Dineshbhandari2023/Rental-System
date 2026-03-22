import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import bookingService from "../../services/bookingService";
import { Package, Clock, MapPin, RefreshCw } from "lucide-react";

export default function BorrowerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeBookings: 0,
    pastBookings: 0,
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");

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

      const bookingsData = data.bookings || [];
      setBookings(bookingsData);

      setStats({
        activeBookings: bookingsData.filter((b) =>
          ["pending", "confirmed", "ongoing"].includes(b.status)
        ).length,
        pastBookings: bookingsData.filter((b) =>
          ["completed", "cancelled", "disputed"].includes(b.status)
        ).length,
      });
    } catch (error) {
      toast.error(error.message || "Failed to load your bookings");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/80x80?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

  const getStatusStyle = (status) => {
    const styles = {
      pending: "bg-amber-900/30 text-amber-300 border-amber-700/50",
      confirmed: "bg-emerald-900/30 text-emerald-300 border-emerald-700/50",
      ongoing: "bg-blue-900/30 text-blue-300 border-blue-700/50",
      completed: "bg-gray-700/50 text-gray-300 border-gray-600",
      cancelled: "bg-red-900/30 text-red-300 border-red-700/50",
      disputed: "bg-purple-900/30 text-purple-300 border-purple-700/50",
    };
    return styles[status] || "bg-gray-800 text-gray-400 border-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100 px-4 py-8 md:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-amber-900/30">
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent">
            Borrower Dashboard
          </h1>
          <p className="mt-3 text-lg text-amber-200/70 font-light tracking-wide">
            Manage your rentals • Track your history • Discover new treasures
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-900/40 rounded-xl p-6 shadow-lg shadow-black/40 hover:shadow-amber-900/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-400/80 font-medium uppercase tracking-wider">
                  Active Rentals
                </p>
                <p className="text-4xl font-serif font-bold text-amber-200 mt-1">
                  {stats.activeBookings}
                </p>
              </div>
              <div className="p-4 bg-amber-900/30 rounded-lg">
                <Clock className="h-8 w-8 text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-900/40 rounded-xl p-6 shadow-lg shadow-black/40 hover:shadow-amber-900/20 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-400/80 font-medium uppercase tracking-wider">
                  Completed / Cancelled
                </p>
                <p className="text-4xl font-serif font-bold text-amber-200 mt-1">
                  {stats.pastBookings}
                </p>
              </div>
              <div className="p-4 bg-amber-900/30 rounded-lg">
                <Package className="h-8 w-8 text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-900/40 rounded-xl p-6 shadow-lg shadow-black/40 hover:shadow-amber-900/20 transition-all duration-300 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-amber-400/80 font-medium uppercase tracking-wider">
                  Total Bookings
                </p>
                <p className="text-4xl font-serif font-bold text-amber-200 mt-1">
                  {stats.activeBookings + stats.pastBookings}
                </p>
              </div>
              <div className="p-4 bg-amber-900/30 rounded-lg">
                <RefreshCw className="h-8 w-8 text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-semibold text-amber-200 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/borrower/browse"
              className="group bg-gradient-to-br from-amber-900/30 to-amber-800/20 border border-amber-700/50 rounded-xl p-6 hover:border-amber-500/60 hover:shadow-lg hover:shadow-amber-900/30 transition-all duration-300 flex items-center gap-5"
            >
              <div className="p-4 bg-amber-900/40 rounded-lg group-hover:bg-amber-800/50 transition-colors">
                <MapPin className="h-7 w-7 text-amber-300" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-lg text-amber-100 group-hover:text-amber-50">
                  Browse Items
                </h3>
                <p className="text-sm text-amber-300/80 mt-1">
                  Discover available items near you
                </p>
              </div>
            </Link>

            <button
              onClick={loadBookings}
              disabled={loading}
              className="group bg-gradient-to-br from-gray-800 to-gray-900 border border-amber-900/40 rounded-xl p-6 hover:border-amber-700/60 hover:shadow-lg hover:shadow-amber-900/20 transition-all duration-300 flex items-center gap-5 disabled:opacity-50"
            >
              <div className="p-4 bg-amber-900/30 rounded-lg group-hover:bg-amber-800/40 transition-colors">
                <RefreshCw
                  className={`h-7 w-7 text-amber-300 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </div>
              <div className="text-left">
                <h3 className="font-serif font-semibold text-lg text-amber-100 group-hover:text-amber-50">
                  Refresh Bookings
                </h3>
                <p className="text-sm text-amber-300/80 mt-1">
                  Update your current list
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-amber-900/40 rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
          <div className="p-6 border-b border-amber-900/30">
            <h2 className="text-2xl font-serif font-semibold text-amber-200">
              My Rentals & Bookings
            </h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 bg-gray-800/50 rounded-xl animate-pulse"
                  />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-16">
                <Package className="mx-auto h-16 w-16 text-amber-700/50" />
                <h3 className="mt-6 text-xl font-serif text-amber-200">
                  No bookings yet
                </h3>
                <p className="mt-3 text-amber-300/70">
                  Start exploring items available in your community
                </p>
                <Link
                  to="/borrower/browse"
                  className="mt-6 inline-block bg-amber-800/40 hover:bg-amber-700/60 text-amber-100 px-8 py-3 rounded-lg border border-amber-600/50 transition-all duration-300"
                >
                  Browse Available Items
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {bookings.map((booking) => (
                  <Link
                    key={booking._id}
                    to={`/borrower/bookings/${booking._id}`}
                    className="block p-5 bg-gray-800/40 border border-amber-900/30 rounded-xl hover:border-amber-700/60 hover:bg-gray-800/60 transition-all duration-300 group"
                  >
                    <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                      <div className="flex gap-5 flex-1 min-w-0">
                        <img
                          src={getImageUrl(booking.itemId?.images?.[0])}
                          alt={booking.itemId?.title}
                          className="h-20 w-20 object-cover rounded-lg border border-amber-900/40 shadow-sm"
                        />
                        <div className="min-w-0">
                          <h3 className="font-serif font-semibold text-lg text-amber-100 group-hover:text-amber-50 truncate">
                            {booking.itemId?.title ||
                              "Item no longer available"}
                          </h3>
                          <p className="text-sm text-amber-300/80 mt-1">
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
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 sm:flex-col sm:items-end">
                        <span
                          className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-amber-200">
                            ${booking.totalAmount}
                          </p>
                          <p className="text-xs text-amber-400/70">
                            {booking.totalDays} day
                            {booking.totalDays > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
