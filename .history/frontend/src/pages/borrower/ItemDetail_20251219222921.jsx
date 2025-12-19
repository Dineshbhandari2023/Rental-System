import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import itemService from "../../services/itemService";
import { Calendar, DollarSign, MapPin, Shield } from "lucide-react";
import BookingForm from "./BookingForm"; // Separate component below

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const navigate = useNavigate();

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");
  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const response = await itemService.getItemById(id);
      setItem(response.item || response);
    } catch (error) {
      toast.error("Failed to load item");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!item)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-600">
        Item not found
      </div>
    );
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 md:py-12">
      <button
        onClick={() => navigate("/borrower/browse")}
        className="mb-6 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
      >
        ← Back to Browse
      </button>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <img
            src={getImageUrl(item.images[currentImage])}
            alt={item.title}
            onClick={() => setIsZoomOpen(true)}
            className="w-full rounded-xl object-cover aspect-video cursor-zoom-in"
          />

          <div className="grid grid-cols-4 gap-2">
            {item.images.map((img, i) => (
              <img
                key={i}
                src={getImageUrl(img)}
                alt={`Thumbnail ${i + 1}`}
                onClick={() => setCurrentImage(i)}
                className={`h-20 w-full object-cover rounded-lg cursor-pointer border ${
                  currentImage === i
                    ? "ring-2 ring-blue-600"
                    : "opacity-80 hover:opacity-100"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <p className="text-gray-600">{item.description}</p>

          <div className="flex gap-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full">
              {item.category}
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">
              {item.condition}
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border">
            <p className="font-bold text-2xl">${item.dailyPrice}/day</p>
            <p className="text-gray-600">Deposit: ${item.depositAmount}</p>
          </div>

          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-gray-600" />
            <p>{item.addressText}</p>
          </div>

          {item.rules.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Rules</h3>
              <ul className="list-disc pl-4 space-y-1">
                {item.rules.map((rule, i) => (
                  <li key={i}>{rule}</li>
                ))}
              </ul>
            </div>
          )}
          {isZoomOpen && (
            <div
              className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
              onClick={() => setIsZoomOpen(false)}
            >
              <button
                onClick={() => setIsZoomOpen(false)}
                className="absolute top-6 right-6 text-white text-3xl font-bold"
              >
                ✕
              </button>

              <img
                src={getImageUrl(item.images[currentImage])}
                alt={item.title}
                onClick={(e) => e.stopPropagation()}
                className="max-h-[90vh] max-w-[90vw] object-contain cursor-zoom-out"
              />
            </div>
          )}

          {/* Booking Form */}
          <BookingForm item={item} />
        </div>
      </div>
    </div>
  );
}
