import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import itemService from "../../services/itemService";
import bookingService from "../../services/bookingService";
import { Calendar, DollarSign, User, AlertCircle } from "lucide-react";

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      const data = await bookingService.getBookingById(id);
      setBooking(data.booking);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await bookingService.cancelBooking(id, {
        cancellationReason: "Changed my mind",
      });
      toast.success("Booking cancelled");
      loadBooking(); // refresh
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Booking not found
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border p-6 space-y-6">
        <h1 className="text-3xl font-bold">Booking Details</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={booking.itemId.images[0]}
            alt={booking.itemId.title}
            className="h-48 w-full md:w-48 object-cover rounded-xl"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold">{booking.itemId.title}</h2>
            <p className="text-gray-600 mt-2">
              Status:{" "}
              <span className="capitalize font-medium">{booking.status}</span>
            </p>
            <div className="mt-4 space-y-2">
              <p className="flex items-center gap-2">
                <Calendar size={20} />{" "}
                {new Date(booking.startDate).toLocaleDateString()} -{" "}
                {new Date(booking.endDate).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-2">
                <DollarSign size={20} /> Total: ${booking.totalAmount} (Deposit:
                ${booking.depositAmount})
              </p>
              <p className="flex items-center gap-2">
                <User size={20} /> Lender: {booking.lenderId.firstName}{" "}
                {booking.lenderId.lastName}
              </p>
            </div>
          </div>
        </div>

        {booking.cancellationReason && (
          <div className="p-4 bg-red-50 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <p className="font-medium text-red-900">Cancelled</p>
              <p className="text-red-800">{booking.cancellationReason}</p>
            </div>
          </div>
        )}

        {["pending", "confirmed"].includes(booking.status) && (
          <button
            onClick={handleCancel}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
}
