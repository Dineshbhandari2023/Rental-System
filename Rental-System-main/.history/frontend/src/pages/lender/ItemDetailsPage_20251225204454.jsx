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
      setItem(response.item || response); // Handle { item } or direct object
    } catch (error) {
      toast.error(error.message || "Failed to load item");
      navigate("/lender/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Permanently delete this item? This cannot be undone."))
      return;

    try {
      await itemService.deleteItem(id);
      toast.success("Item deleted successfully");
      navigate("/lender/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to delete item");
    }
  };

  const baseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:8000";

  if (loading) return <LoadingSkeleton />;
  if (!item) return <NotFound />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex items-center gap-4">
            <Link to="/lender/dashboard">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={24} />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{item.title}</h1>
              <p className="text-gray-600">{item.category}</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link to={`/lender/items/${item._id}/edit`}>
              <button className="px-5 py-3 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <Edit size={16} /> Edit
              </button>
            </Link>
            <button
              onClick={handleDelete}
              className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
              {item.images?.length > 0 ? (
                <img
                  src={`${baseUrl}${item.images[currentImageIndex]}`}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={80} className="text-gray-400" />
                </div>
              )}
            </div>

            {item.images?.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {item.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === idx
                        ? "border-blue-600"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={`${baseUrl}${img}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="flex gap-3 flex-wrap">
              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  item.isAvailable
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {item.isAvailable ? "Available" : "Not Available"}
              </span>
              <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                {item.condition}
              </span>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              {item.description}
            </p>

            <div className="grid grid-cols-2 gap-6 bg-white p-6 rounded-xl border">
              <div>
                <p className="text-gray-600 flex items-center gap-2">
                  <DollarSign size={18} /> Daily Rate
                </p>
                <p className="text-3xl font-bold mt-2">${item.dailyPrice}</p>
              </div>
              <div>
                <p className="text-gray-600 flex items-center gap-2">
                  <Shield size={18} /> Security Deposit
                </p>
                <p className="text-2xl font-bold mt-2">${item.depositAmount}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <MapPin size={18} /> Location
              </h3>
              <p className="text-gray-700">{item.addressText}</p>
            </div>

            {item.rules?.length > 0 && (
              <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-semibold mb-3">Rental Rules</h3>
                <ul className="space-y-2">
                  {item.rules.map((rule, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-blue-600">•</span>
                      <span className="text-gray-700">{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold flex items-center gap-2 mb-3">
                <Calendar size={18} /> Availability Periods
              </h3>
              {item.availability?.length > 0 ? (
                <div className="space-y-2">
                  {item.availability.map((period, i) => (
                    <div key={i} className="text-gray-700">
                      {new Date(period.startDate).toLocaleDateString()} →{" "}
                      {new Date(period.endDate).toLocaleDateString()}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No specific dates set</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
          <div className="space-y-6">
            <div className="h-8 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-48 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Package size={80} className="text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Item not found</h2>
        <Link
          to="/lender/dashboard"
          className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
