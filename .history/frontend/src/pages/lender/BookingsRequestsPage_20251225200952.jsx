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
import bookingService from "@/services/bookingService";
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
      // We'll create a new endpoint or reuse getLenderBookings if exists
      // For now, assuming you add a lender-specific endpoint
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
    if (
      !window.confirm(
        `Are you sure you want to ${
          newStatus === "confirmed" ? "approve" : "reject"
        } this booking request?`
      )
    ) {
      return;
    }

    try {
      setProcessingId(bookingId);
      await bookingService.updateBookingStatus(bookingId, {
        status: newStatus,
      });

      toast.success(
        `Booking request ${
          newStatus === "confirmed" ? "approved" : "rejected"
        } successfully`
      );

      // Remove from list or update status
      setRequests((prev) => prev.filter((req) => req._id !== bookingId));
    } catch (error) {
      toast.error(error.message || "Failed to update booking status");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="h-24 w-32 bg-gray-200 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Booking Requests</h1>
          <p className="text-gray-600 mt-2">
            Review and manage incoming rental requests
          </p>
        </div>

        {requests.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No pending booking requests
            </h3>
            <p className="text-gray-600">
              When borrowers request to rent your items, they will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {requests.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Item Image */}
                    <div className="flex-shrink-0">
                      <div className="relative h-32 w-40 rounded-lg overflow-hidden bg-gray-100">
                        {booking.itemId?.images?.[0] ? (
                          <img
                            src={booking.itemId.images[0]}
                            alt={booking.itemId.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {booking.itemId?.title || "Unknown Item"}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="h-5 w-5 text-gray-500" />
                          <span>
                            <strong>Borrower:</strong>{" "}
                            {booking.borrowerId
                              ? `${booking.borrowerId.firstName} ${booking.borrowerId.lastName}`
                              : "Unknown"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <span>
                            <strong>Dates:</strong>{" "}
                            {format(new Date(booking.startDate), "MMM d, yyyy")}{" "}
                            → {format(new Date(booking.endDate), "MMM d, yyyy")}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <span>
                            <strong>Duration:</strong> {booking.totalDays} days
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <span>
                            <strong>Total Amount:</strong> $
                            {booking.totalAmount}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700 md:col-span-2">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <span>
                            <strong>Security Deposit:</strong> $
                            {booking.depositAmount}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 lg:items-end">
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        <AlertCircle className="h-4 w-4" />
                        Pending Approval
                      </span>

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "confirmed")
                          }
                          disabled={processingId === booking._id}
                          className="inline-flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                        >
                          <CheckCircle className="h-5 w-5" />
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, "cancelled")
                          }
                          disabled={processingId === booking._id}
                          className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition disabled:opacity-50"
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
