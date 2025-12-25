import { useState, useEffect } from "react";
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
} from "lucide-react";
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
      setRequests(response.bookings || []);
    } catch (error) {
      toast.error(error.message || "Failed to load booking requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const action = newStatus === "confirmed" ? "approve" : "reject";

    if (!window.confirm(`Are you sure you want to ${action} this request?`)) {
      return;
    }

    try {
      setProcessingId(bookingId);

      // Uses your existing updateBookingStatus!
      await bookingService.updateBookingStatus(bookingId, {
        status: newStatus,
      });

      toast.success(`Booking ${action}d successfully!`);

      // Remove from list after action
      setRequests((prev) => prev.filter((req) => req._id !== bookingId));
    } catch (error) {
      toast.error(error.message || `Failed to ${action} booking`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border p-6 animate-pulse"
              >
                <div className="flex gap-6">
                  <div className="h-32 w-40 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-2/3" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-5 bg-gray-200 rounded" />
                      <div className="h-5 bg-gray-200 rounded" />
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
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
          <p className="text-gray-600 mt-2">
            Review and manage incoming rental requests for your items
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No pending requests
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              When someone wants to rent one of your items, their request will
              appear here for you to approve or reject.
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {requests.map((booking) => (
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
                      <h3 className="text-2xl font-bold text-gray-900 mb-5">
                        {booking.itemId?.title}
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-base">
                        <div className="flex items-center gap-3">
                          <User className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">Borrower</p>
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
                              Rental Dates
                            </p>
                            <p className="font-medium">
                              {format(new Date(booking.startDate), "MMM d")} –{" "}
                              {format(new Date(booking.endDate), "MMM d, yyyy")}
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
                              Total Amount
                            </p>
                            <p className="font-bold text-lg">
                              ${booking.totalAmount}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 sm:col-span-2">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Security Deposit
                            </p>
                            <p className="font-medium">
                              ${booking.depositAmount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-stretch lg:items-end gap-4">
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                        <AlertCircle className="h-5 w-5" />
                        Pending Approval
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "confirmed")
                          }
                          disabled={processingId === booking._id}
                          className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium rounded-lg transition shadow-sm"
                        >
                          <CheckCircle className="h-5 w-5" />
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "cancelled")
                          }
                          disabled={processingId === booking._id}
                          className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition shadow-sm"
                        >
                          <XCircle className="h-5 w-5" />
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
      </div>
    </div>
  );
}
