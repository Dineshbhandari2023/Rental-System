import { useState, useEffect } from "react";
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
} from "lucide-react";
import bookingService from "@/services/bookingService";
import { toast } from "sonner";

const statusConfig = {
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
    icon: AlertTriangle,
    color: "bg-red-100 text-red-800",
  },
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLenderBookings();
  }, []);

  const loadLenderBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getLenderBookings();
      setBookings(response.bookings || []);
    } catch (error) {
      toast.error(error.message || "Failed to load your rentals");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) =>
    statusConfig[status] || statusConfig.cancelled;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="h-40 w-52 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-5">
                    <div className="h-8 bg-gray-200 rounded w-3/4" />
                    <div className="grid grid-cols-2 gap-6">
                      <div className="h-6 bg-gray-200 rounded" />
                      <div className="h-6 bg-gray-200 rounded" />
                      <div className="h-6 bg-gray-200 rounded" />
                      <div className="h-6 bg-gray-200 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My Rentals</h1>
          <p className="text-gray-600 mt-2">
            Track all active and past rentals of your items
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No rentals yet
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Once you approve a booking request, it will appear here as an
              active rental.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {bookings.map((booking) => {
              const status = getStatusConfig(booking.status);

              return (
                <div
                  key={booking._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Item Image */}
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

                      {/* Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-5">
                          <h3 className="text-2xl font-bold text-gray-900">
                            {booking.itemId?.title}
                          </h3>
                          <div
                            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold ${status.color}`}
                          >
                            <status.icon className="h-5 w-5" />
                            {status.label}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-base">
                          <div className="flex items-center gap-3">
                            <User className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">Rented to</p>
                              <p className="font-medium">
                                {booking.borrowerId
                                  ? `${booking.borrowerId.firstName} ${booking.borrowerId.lastName}`
                                  : "Unknown"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Rental Period
                              </p>
                              <p className="font-medium">
                                {format(new Date(booking.startDate), "MMM d")} –{" "}
                                {format(
                                  new Date(booking.endDate),
                                  "MMM d, yyyy"
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
                              <p className="text-sm text-gray-500">
                                Rental Income
                              </p>
                              <p className="font-bold text-lg">
                                ${booking.totalAmount}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <DollarSign className="h-5 w-5 text-gray-500" />
                            <div>
                              <p className="text-sm text-gray-500">
                                Security Deposit
                              </p>
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

                          {booking.status === "ongoing" && (
                            <div className="flex items-center gap-3 lg:col-span-3">
                              <AlertTriangle className="h-5 w-5 text-orange-500" />
                              <p className="text-orange-600 font-medium">
                                Item is currently with borrower
                              </p>
                            </div>
                          )}
                        </div>
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
