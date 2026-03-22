// src/pages/borrower/ItemDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import {} from "react-router-dom";
import itemService from "../../services/itemService";
import reviewService from "../../services/reviewService";
import authService from "../../services/authService";
import {
  MapPin,
  Star,
  MessageSquare,
  Loader2,
  ArrowLeft,
  Calendar,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
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

  // Review form (currently disabled with message — as per your logic)
  const currentUser = authService.getCurrentUser();
  const isBorrower = currentUser?.role === "borrower";
  const isLoggedIn = authService.isAuthenticated();

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

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
      toast.error("Failed to load item details");
    } finally {
      setLoadingItem(false);
    }
  };

  const loadReviews = async () => {
    try {
      setLoadingReviews(true);
      const data = await reviewService.getItemReviews(id, { limit: 10 });
      setReviewsData(data);
    } catch (error) {
      console.error("Failed to load reviews", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/800x600?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

  if (loadingItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center text-amber-300/80 text-xl">
        Item not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/borrower/browse")}
          className="mb-8 inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-medium transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
          Back to Browse
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* ─── Image Gallery ─── */}
          <div className="space-y-6">
            <div
              className="relative rounded-2xl overflow-hidden border-2 border-amber-900/40 shadow-2xl shadow-black/50 cursor-zoom-in group"
              onClick={() => setIsZoomOpen(true)}
            >
              <img
                src={getImageUrl(item.images[currentImage])}
                alt={item.title}
                className="w-full aspect-[4/3] md:aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Thumbnails */}
            {item.images.length > 1 && (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                {item.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      currentImage === i
                        ? "border-amber-500 shadow-lg shadow-amber-900/40 scale-105"
                        : "border-amber-900/40 opacity-70 hover:opacity-100 hover:border-amber-700/60"
                    }`}
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`Thumbnail ${i + 1}`}
                      className="w-full aspect-square object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── Item Info ─── */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent leading-tight">
                {item.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4">
                <span className="inline-flex items-center px-4 py-1.5 bg-amber-950/60 border border-amber-800/50 rounded-full text-amber-200 text-sm font-medium">
                  {item.category}
                </span>
                <span className="inline-flex items-center px-4 py-1.5 bg-gray-800/60 border border-gray-700 rounded-full text-gray-300 text-sm">
                  {item.condition}
                </span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/50 rounded-2xl p-6 shadow-xl shadow-black/40">
              <div className="flex items-baseline gap-3">
                <DollarSign className="h-8 w-8 text-amber-400" />
                <span className="text-5xl font-bold text-amber-200">
                  ${item.dailyPrice}
                </span>
                <span className="text-2xl text-amber-400/80">/day</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-amber-300/90">
                <ShieldCheck size={18} />
                <span>Refundable deposit: ${item.depositAmount}</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-invert max-w-none">
              <p className="text-amber-100/90 leading-relaxed text-lg">
                {item.description}
              </p>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3 text-amber-300/90">
              <MapPin className="h-6 w-6 text-amber-500" />
              <span className="text-lg">
                {item.addressText || "Location not specified"}
              </span>
            </div>

            {/* Rules */}
            {item.rules?.length > 0 && (
              <div className="pt-4 border-t border-amber-900/30">
                <h3 className="text-xl font-serif font-semibold text-amber-200 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Rental Guidelines
                </h3>
                <ul className="space-y-2 text-amber-300/90">
                  {item.rules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Booking Form */}
            <div className="pt-6 border-t border-amber-900/30">
              <BookingForm item={item} />
            </div>
          </div>
        </div>

        {/* ─── REVIEWS SECTION ─── */}
        <div className="mt-16 max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/40 rounded-2xl shadow-2xl shadow-black/40 p-6 md:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10 pb-6 border-b border-amber-900/30">
              <h2 className="text-3xl font-serif font-bold text-amber-200 flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-amber-500" />
                Community Reviews
              </h2>

              {reviewsData && (
                <div className="flex items-center gap-4 bg-amber-950/40 px-5 py-3 rounded-xl border border-amber-900/50">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={24}
                        className={`${
                          i < Math.round(reviewsData.averageRating || 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-amber-800/60"
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-200">
                      {reviewsData.averageRating?.toFixed(1) || "—"}
                    </div>
                    <div className="text-sm text-amber-400/80">
                      {reviewsData.totalReviews || 0} reviews
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Review Submission Guidance */}
            <div className="mb-12 p-6 bg-amber-950/30 border border-amber-900/40 rounded-xl text-center">
              {isLoggedIn && isBorrower ? (
                <>
                  <h3 className="text-xl font-serif font-semibold text-amber-200 mb-3 flex items-center justify-center gap-2">
                    <Star className="h-6 w-6 text-amber-400" />
                    Share Your Experience
                  </h3>
                  <p className="text-amber-300/80 mb-6 max-w-2xl mx-auto">
                    You can leave a review for this item after completing a
                    rental period with the owner.
                  </p>
                  <Link
                    to="/borrower/bookings"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-amber-800/50 hover:bg-amber-700/60 border border-amber-700/50 rounded-lg text-amber-100 font-medium transition-all"
                  >
                    View My Bookings
                  </Link>
                </>
              ) : isLoggedIn ? (
                <p className="text-amber-300/80 text-lg">
                  Only borrowers can leave reviews on items.
                </p>
              ) : (
                <p className="text-amber-300/80 text-lg">
                  <button
                    onClick={() => navigate("/login")}
                    className="text-amber-400 hover:text-amber-300 font-medium underline decoration-dotted"
                  >
                    Sign in
                  </button>{" "}
                  to leave a review after renting this item.
                </p>
              )}
            </div>

            {/* Reviews List */}
            {loadingReviews ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-10 w-10 text-amber-500 animate-spin" />
              </div>
            ) : reviewsData?.reviews?.length > 0 ? (
              <div className="space-y-8">
                {reviewsData.reviews.map((review) => (
                  <div
                    key={review._id}
                    className="border-b border-amber-900/30 pb-8 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={18}
                              className={`${
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-amber-800/50"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium text-amber-200">
                          {review.reviewerId?.firstName}{" "}
                          {review.reviewerId?.lastName?.charAt(0) || ""}
                        </span>
                      </div>
                      <span className="text-sm text-amber-400/70">
                        {new Date(review.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                    <p className="text-amber-100/90 leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-amber-400/70">
                No reviews yet. Be the first to share your experience after
                renting!
              </div>
            )}
          </div>
        </div>

        {/* Full-screen Image Zoom */}
        {isZoomOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setIsZoomOpen(false)}
          >
            <button
              className="absolute top-6 right-6 text-amber-200 text-5xl font-light hover:text-amber-100 transition-colors"
              onClick={() => setIsZoomOpen(false)}
            >
              ×
            </button>
            <img
              src={getImageUrl(item.images[currentImage])}
              alt={item.title}
              className="max-h-[90vh] max-w-[95vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </div>
  );
}
