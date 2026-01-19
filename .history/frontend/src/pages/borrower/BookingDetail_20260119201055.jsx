// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { toast } from "sonner";
// import bookingService from "../../services/bookingService";
// import { Calendar, DollarSign, User, AlertCircle } from "lucide-react";

// export default function BookingDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [booking, setBooking] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");

//   const getImageUrl = (path) => {
//     if (!path) return "";
//     if (path.startsWith("http")) return path;
//     return `${API_BASE_URL}${path}`;
//   };

//   useEffect(() => {
//     loadBooking();
//   }, [id]);

//   const loadBooking = async () => {
//     try {
//       setLoading(true);
//       const data = await bookingService.getBookingById(id);
//       setBooking(data.booking || data);
//     } catch (error) {
//       toast.error(error.message || "Failed to load booking");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = async () => {
//     if (!window.confirm("Cancel this booking?")) return;
//     try {
//       await bookingService.cancelBooking(id, {
//         cancellationReason: "Changed my mind",
//       });
//       toast.success("Booking cancelled");
//       loadBooking();
//     } catch (error) {
//       toast.error(error.message || "Failed to cancel booking");
//     }
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );

//   if (!booking)
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
//         Booking not found
//       </div>
//     );

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 md:py-12">
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-6 text-blue-600 hover:underline"
//       >
//         ← Back
//       </button>

//       <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border p-6 space-y-6">
//         <h1 className="text-3xl font-bold">Booking Details</h1>

//         <div className="flex flex-col md:flex-row gap-6">
//           <img
//             src={getImageUrl(booking.itemId?.images?.[0])}
//             alt={booking.itemId?.title}
//             className="h-48 w-full md:w-48 object-cover rounded-xl"
//           />

//           <div className="flex-1">
//             <h2 className="text-2xl font-semibold">{booking.itemId?.title}</h2>

//             <p className="text-gray-600 mt-2">
//               Status:{" "}
//               <span className="capitalize font-medium">{booking.status}</span>
//             </p>

//             <div className="mt-4 space-y-2">
//               <p className="flex items-center gap-2">
//                 <Calendar size={18} />
//                 {new Date(booking.startDate).toLocaleDateString()} –{" "}
//                 {new Date(booking.endDate).toLocaleDateString()}
//               </p>

//               <p className="flex items-center gap-2">
//                 <DollarSign size={18} />
//                 Total: ${booking.totalAmount} (Deposit: ${booking.depositAmount}
//                 )
//               </p>

//               <p className="flex items-center gap-2">
//                 <User size={18} />
//                 Lender: {booking.lenderId?.firstName}{" "}
//                 {booking.lenderId?.lastName}
//               </p>
//             </div>
//           </div>
//         </div>

//         {booking.cancellationReason && (
//           <div className="p-4 bg-red-50 rounded-lg flex items-start gap-3">
//             <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
//             <div>
//               <p className="font-medium text-red-900">Cancelled</p>
//               <p className="text-red-800">{booking.cancellationReason}</p>
//             </div>
//           </div>
//         )}

//         {["pending", "confirmed"].includes(booking.status) && (
//           <button
//             onClick={handleCancel}
//             className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
//           >
//             Cancel Booking
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import bookingService from "../../services/bookingService";
import reviewService from "../../services/reviewService"; // ← Add this
import authService from "../../services/authService"; // ← Add this
import {
  Calendar,
  DollarSign,
  User,
  AlertCircle,
  Star,
  Loader2,
} from "lucide-react";

export default function BookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const currentUser = authService.getCurrentUser();
  const isBorrower = currentUser?.role === "borrower";

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

  useEffect(() => {
    loadBooking();
  }, [id]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getBookingById(id);
      const fetchedBooking = data.booking || data;
      setBooking(fetchedBooking);

      // Check if borrower already reviewed this booking
      if (isBorrower && fetchedBooking.status === "completed") {
        try {
          const reviews = await reviewService.getItemReviews(
            fetchedBooking.itemId._id || fetchedBooking.itemId
          );
          const alreadyReviewed = reviews.reviews?.some(
            (r) =>
              r.bookingId === fetchedBooking._id &&
              r.reviewerId?._id === currentUser._id
          );
          setHasReviewed(alreadyReviewed);
        } catch (err) {
          console.log("Could not check review status");
        }
      }
    } catch (error) {
      toast.error(error.message || "Failed to load booking");
    } finally {
      setLoading(false);
    }
  };

  // const handleSubmitReview = async () => {
  //   if (rating === 0) {
  //     toast.error("Please give a star rating");
  //     return;
  //   }
  //   if (!comment.trim()) {
  //     toast.error("Please write a comment");
  //     return;
  //   }

  //   setSubmitting(true);
  //   try {
  //     await reviewService.createReview({
  //       bookingId: booking._id,
  //       type: "user_to_item",
  //       rating,
  //       comment: comment.trim(),
  //     });

  //     toast.success("Thank you! Your review has been submitted.");
  //     setHasReviewed(true);
  //     setRating(0);
  //     setComment("");
  //   } catch (err) {
  //     toast.error(err.error || "Failed to submit review");
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a rating");
    if (!comment.trim()) return toast.error("Please write a comment");

    setSubmitting(true);
    try {
      const result = await reviewService.submitBothReviews({
        bookingId: id, // from useParams()
        rating,
        comment,
        reviewLender: true, // or false if you don't want lender review
        reviewItem: true,
        // itemId: booking.itemId?._id   // optional safety — backend should get it from booking anyway
      });

      if (result.allSucceeded) {
        toast.success("Thank you! Your review(s) have been submitted.");
        navigate("/borrower/bookings");
      } else {
        toast.warning("Review submitted, but some parts failed. Please check.");
        console.log("Partial failure:", result.failed);
      }
    } catch (err) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await bookingService.cancelBooking(id, {
        cancellationReason: "Changed my mind",
      });
      toast.success("Booking cancelled");
      loadBooking();
    } catch (error) {
      toast.error(error.message || "Failed to cancel booking");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );

  if (!booking)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Booking not found
      </div>
    );

  const isCompleted = booking.status === "completed";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 md:py-12">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline font-medium"
      >
        ← Back to My Bookings
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border p-6 md:p-8 space-y-8">
        <h1 className="text-3xl font-bold">Booking Details</h1>

        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={getImageUrl(booking.itemId?.images?.[0])}
            alt={booking.itemId?.title}
            className="h-64 w-full md:w-80 object-cover rounded-xl shadow-md"
          />

          <div className="flex-1 space-y-5">
            <div>
              <h2 className="text-2xl font-bold">{booking.itemId?.title}</h2>
              <p className="text-gray-600 mt-1">
                by {booking.lenderId?.firstName} {booking.lenderId?.lastName}
              </p>
            </div>

            <div className="flex items-center gap-3 text-lg">
              <span
                className="px-4 py-2 rounded-full font-medium
                ${booking.status === 'completed' ? 'bg-green-100 text-green-800' : 
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'}"
              >
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
            </div>

            <div className="space-y-3 text-gray-700">
              <p className="flex items-center gap-3">
                <Calendar size={20} />
                <span>
                  {new Date(booking.startDate).toLocaleDateString()} –{" "}
                  {new Date(booking.endDate).toLocaleDateString()}
                </span>
              </p>
              <p className="flex items-center gap-3">
                <DollarSign size={20} />
                <span>
                  Total: <strong>${booking.totalAmount}</strong> (Deposit: $
                  {booking.depositAmount})
                </span>
              </p>
              <p className="flex items-center gap-3">
                <User size={20} />
                Lender: {booking.lenderId?.firstName}{" "}
                {booking.lenderId?.lastName}
              </p>
            </div>

            {booking.cancellationReason && (
              <div className="p-4 bg-red-50 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">Booking Cancelled</p>
                  <p className="text-red-800">{booking.cancellationReason}</p>
                </div>
              </div>
            )}

            {["pending", "confirmed"].includes(booking.status) && (
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>

        {/* REVIEW SECTION - Only show for borrower when completed */}
        {isBorrower && isCompleted && (
          <div className="border-t pt-8 mt-8">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star size={28} className="text-yellow-500" />
              Rate Your Experience
            </h3>

            {hasReviewed ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <Star
                  size={48}
                  className="mx-auto text-green-600 fill-current mb-3"
                />
                <p className="text-lg font-medium text-green-800">
                  Thank you for your review!
                </p>
                <p className="text-green-700">
                  Your feedback helps the community.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-gray-700 mb-4">
                    How was your experience with this item?
                  </p>
                  <div className="flex gap-2 justify-center md:justify-start">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star
                          size={42}
                          className={`${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          } hover:text-yellow-400`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your thoughts about the item, condition, lender communication, etc..."
                  rows={5}
                  className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  required
                />

                <button
                  onClick={handleSubmitReview}
                  disabled={submitting || rating === 0}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
