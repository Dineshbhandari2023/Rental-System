import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import itemService from "../../services/itemService";
import reviewService from "../../services/reviewService"; // ← new import
import authService from "../../services/authService"; // to check if logged in + role
import { MapPin, Star, MessageSquare, Loader2 } from "lucide-react";
import BookingForm from "./BookingForm";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);
  const [loadingItem, setLoadingItem] = useState(true);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false); // optional: prevent multiple reviews

  const currentUser = authService.getCurrentUser();
  const isBorrower = currentUser?.role === "borrower";
  const isLoggedIn = authService.isAuthenticated();

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");

  useEffect(() => {
    loadItem();
    loadReviews();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoadingItem(true);
      const response = await itemService.getItemById(id);
      setItem(response.item || response);
    } catch (error) {
      toast.error("Failed to load item");
    } finally {
      setLoadingItem(false);
    }
  };

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const data = await reviewService.getItemReviews(id, { limit: 10 });
      setReviewsData(data);

      // Optional: check if current user already reviewed this item
      if (isLoggedIn && isBorrower) {
        const alreadyReviewed = data.reviews?.some(
          (r) => r.reviewerId?._id === currentUser._id
        );
        setHasReviewed(alreadyReviewed);
      }
    } catch (error) {
      console.error("Failed to load reviews", error);
      // toast.error("Could not load reviews");  ← optional
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmittingReview(true);
    try {
      // For simplicity — submitting only item review
      // You can extend to also submit lender review using submitBothReviews
      await reviewService.createReview({
        bookingId: null,
        type: "user_to_item",
        rating,
        comment,
      });

      toast.success("Thank you! Your review has been submitted.");
      setRating(0);
      setComment("");
      setHasReviewed(true);
      loadReviews(); // refresh reviews
    } catch (err) {
      toast.error(err.error || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

  if (loadingItem) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Item not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 md:py-12">
      {/* Back Button */}
      <button
        onClick={() => navigate("/borrower/browse")}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        ← Back to Browse
      </button>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <img
            src={getImageUrl(item.images[currentImage])}
            alt={item.title}
            onClick={() => setIsZoomOpen(true)}
            className="w-full aspect-video object-cover rounded-xl cursor-zoom-in shadow-md"
          />

          <div className="grid grid-cols-4 gap-2">
            {item.images.map((img, i) => (
              <img
                key={i}
                src={getImageUrl(img)}
                alt={`Thumbnail ${i + 1}`}
                onClick={() => setCurrentImage(i)}
                className={`h-20 w-full object-cover rounded-lg cursor-pointer border-2 transition-all ${
                  currentImage === i
                    ? "border-blue-600 shadow-sm"
                    : "border-transparent opacity-75 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <p className="text-gray-700 leading-relaxed">{item.description}</p>

          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {item.category}
            </span>
            <span className="px-4 py-1.5 bg-gray-100 rounded-full text-sm font-medium">
              {item.condition}
            </span>
          </div>

          <div className="p-5 bg-white rounded-xl border shadow-sm">
            <p className="text-3xl font-bold text-gray-900">
              ${item.dailyPrice}
              <span className="text-lg font-normal text-gray-600">/day</span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Refundable deposit: ${item.depositAmount}
            </p>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <MapPin size={20} />
            <span>{item.addressText}</span>
          </div>

          {item.rules?.length > 0 && (
            <div className="pt-2">
              <h3 className="font-semibold text-lg mb-2">Rental Rules</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-gray-700">
                {item.rules.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Booking Form */}
          <div className="pt-4 border-t">
            <BookingForm item={item} />
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────
          REVIEWS SECTION
      ──────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto mt-12">
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare size={24} className="text-blue-600" />
              Reviews
            </h2>

            {reviewsData && (
              <div className="flex items-center gap-2 text-lg">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={`${
                        i < Math.round(reviewsData.averageRating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">
                  {reviewsData.averageRating?.toFixed(1) || "—"}
                </span>
                <span className="text-gray-500 text-base">
                  ({reviewsData.totalReviews || 0} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Instead of form — helpful message */}
          {isLoggedIn && isBorrower ? (
            <div className="mb-10 pb-8 border-b bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Star size={20} className="text-yellow-500" />
                Want to leave a review?
              </h3>
              <p className="text-gray-700 mb-4">
                You can review this item after you have completed a rental
                period.
              </p>
              <button
                onClick={() => navigate("/borrower/bookings")}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Go to My Bookings
              </button>
            </div>
          ) : isLoggedIn ? (
            <div className="mb-10 pb-8 border-b text-center text-gray-600 py-6">
              Only borrowers can leave reviews.
            </div>
          ) : (
            <div className="mb-10 pb-8 border-b text-center text-gray-600 py-6">
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:underline font-medium"
              >
                Log in
              </button>{" "}
              to leave a review after renting this item.
            </div>
          )}

          {/* Reviews list – remains the same */}
          {loadingReviews ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : reviewsData?.reviews?.length > 0 ? (
            <div className="space-y-6">
              {reviewsData.reviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b pb-6 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          className={`${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">
                      {review.reviewerId?.firstName}{" "}
                      {review.reviewerId?.lastName?.charAt(0) || ""}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No reviews yet. Be the first to share your experience after
              renting!
            </div>
          )}
        </div>
      </div>

      {/* Image Zoom */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 text-white text-4xl font-bold"
          >
            ✕
          </button>
          <img
            src={getImageUrl(item.images[currentImage])}
            alt={item.title}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
