import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import itemService from "../../services/itemService";
import bookingService from "../../services/bookingService";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await bookingService.getMyBookings({ page: 1, limit: 20 });
      setBookings(data.bookings);
      // Update stats if needed
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await itemService.cancelBooking(id, {
        cancellationReason: "User cancelled",
      });
      toast.success("Booking cancelled");
      loadBookings();
    } catch (error) {
      toast.error("Failed to cancel");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
        {loading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-32 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No bookings yet</p>
            <Link
              to="/borrower/browse"
              className="text-blue-600 hover:underline"
            >
              Browse items to book
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white p-6 rounded-xl shadow-sm border"
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex gap-4">
                    <img
                      src={booking.itemId.images[0]}
                      alt={booking.itemId.title}
                      className="h-24 w-24 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">
                        {booking.itemId.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Status:{" "}
                        <span className="capitalize">{booking.status}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Dates:{" "}
                        {new Date(booking.startDate).toLocaleDateString()} -{" "}
                        {new Date(booking.endDate).toLocaleDateString()}
                      </p>
                      <p className="font-semibold mt-2">
                        ${booking.totalAmount}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/borrower/bookings/${booking._id}`}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      View Details
                    </Link>
                    {["pending", "confirmed"].includes(booking.status) && (
                      <button
                        onClick={() => handleCancel(booking._id)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
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
