// src/pages/lender/ItemDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  Shield,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import itemService from "../../services/itemService";

export default function ItemDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) loadItem(id);
  }, [id]);

  const loadItem = async (itemId) => {
    try {
      setLoading(true);
      const response = await itemService.getItemById(itemId);
      setItem(response.item || response);
    } catch (error) {
      toast.error(error.message || "Failed to load item details");
      navigate("/lender/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "This action will permanently delete the listing. Continue?",
      )
    ) {
      return;
    }

    try {
      await itemService.deleteItem(id);
      toast.success("Listing deleted successfully");
      navigate("/lender/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to delete listing");
    }
  };

  const baseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  if (loading) return <LoadingSkeleton />;
  if (!item) return <NotFound />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 text-gray-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/lender/dashboard"
                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
              >
                <ArrowLeft size={24} className="text-gray-300" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {item.title}
                </h1>
                <p className="text-gray-400 mt-1">{item.category}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to={`/lender/items/${item._id}/edit`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl text-gray-200 transition"
              >
                <Edit size={16} />
                Edit Listing
              </Link>

              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-900/60 hover:bg-red-900/80 border border-red-800/50 text-red-200 rounded-xl transition"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Gallery */}
          <section className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl aspect-[4/3] sm:aspect-square">
              {item.images?.length > 0 ? (
                <img
                  src={`${baseUrl}${item.images[currentImageIndex]}`}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-950">
                  <Package size={100} className="text-gray-700" />
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-5 left-5">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm ${
                    item.isAvailable
                      ? "bg-emerald-900/70 text-emerald-300 border border-emerald-800/50"
                      : "bg-rose-900/70 text-rose-300 border border-rose-800/50"
                  }`}
                >
                  {item.isAvailable ? "Available Now" : "Currently Unavailable"}
                </span>
              </div>
            </div>

            {/* Thumbnails */}
            {item.images?.length > 1 && (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`relative rounded-lg overflow-hidden border-2 transition-all duration-200 aspect-square ${
                      currentImageIndex === idx
                        ? "border-amber-600 scale-105 shadow-lg shadow-amber-900/30"
                        : "border-gray-800 hover:border-gray-600"
                    }`}
                  >
                    <img
                      src={`${baseUrl}${img}`}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Details */}
          <section className="space-y-8">
            {/* Price Card */}
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-7 shadow-xl">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-400 flex items-center gap-2 mb-2">
                    <DollarSign size={18} className="text-amber-500" />
                    Daily Rate
                  </p>
                  <p className="text-4xl font-bold text-white">
                    ${item.dailyPrice}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400 flex items-center gap-2 mb-2">
                    <Shield size={18} className="text-amber-500" />
                    Deposit
                  </p>
                  <p className="text-3xl font-bold text-amber-400">
                    ${item.depositAmount}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-7 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4">
                Description
              </h3>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {item.description || "No description provided."}
              </p>
            </div>

            {/* Condition & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                  <Package size={18} className="text-amber-500" />
                  Condition
                </h3>
                <span className="inline-block px-4 py-2 bg-gray-800 rounded-lg text-gray-200">
                  {item.condition}
                </span>
              </div>

              <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 shadow-xl">
                <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
                  <MapPin size={18} className="text-amber-500" />
                  Location
                </h3>
                <p className="text-gray-300">
                  {item.addressText || "Not specified"}
                </p>
              </div>
            </div>

            {/* Rules */}
            {item.rules?.length > 0 && (
              <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-7 shadow-xl">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  Rental Rules
                </h3>
                <ul className="space-y-3">
                  {item.rules.map((rule, i) => (
                    <li key={i} className="flex gap-3 text-gray-300">
                      <span className="text-amber-500 mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Availability */}
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-7 shadow-xl">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={18} className="text-amber-500" />
                Availability Periods
              </h3>

              {item.availability?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {item.availability.map((period, i) => (
                    <div
                      key={i}
                      className="bg-gray-800/50 p-4 rounded-xl border border-gray-700"
                    >
                      <div className="text-gray-300">
                        {new Date(period.startDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </div>
                      <div className="text-gray-500 text-sm mt-1">to</div>
                      <div className="text-gray-300">
                        {new Date(period.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">
                  No specific availability dates set (generally available)
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-10 animate-pulse">
        <div className="h-12 bg-gray-800/60 rounded-xl w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="aspect-square bg-gray-800/60 rounded-2xl" />
          <div className="space-y-8">
            <div className="h-24 bg-gray-800/60 rounded-2xl" />
            <div className="h-48 bg-gray-800/60 rounded-2xl" />
            <div className="h-32 bg-gray-800/60 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <Package size={100} className="text-gray-700 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">Item Not Found</h2>
        <p className="text-gray-400 mb-8">
          The listing you're looking for doesn't exist or has been removed.
        </p>
        <Link
          to="/lender/dashboard"
          className="inline-flex items-center gap-2 px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-amber-900/30"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
