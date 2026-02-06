// src/pages/lender/NewItemPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Save,
  Image as ImageIcon,
  MapPin,
  DollarSign,
  FileText,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";
import itemService from "../../services/itemService";

const CATEGORIES = [
  "Electronics",
  "Tools",
  "Vehicles",
  "Real Estate",
  "Sports Equipment",
  "Furniture",
  "Party Supplies",
  "Camera & Photography",
  "Other",
];

const CONDITIONS = ["New", "Like New", "Good", "Fair", "Poor"];

export default function NewItemPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]); // File objects
  const [imagePreviews, setImagePreviews] = useState([]); // Data URLs
  const [rules, setRules] = useState([""]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    dailyPrice: "",
    depositAmount: "",
    condition: "Good",
    addressText: "",
    coordinates: { lat: "", lng: "" },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index, value) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };

  const addRule = () => setRules((prev) => [...prev, ""]);
  const removeRule = (index) =>
    setRules((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("At least one image is required");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("dailyPrice", parseFloat(formData.dailyPrice) || 0);
      formDataToSend.append(
        "depositAmount",
        parseFloat(formData.depositAmount) || 0,
      );
      formDataToSend.append("condition", formData.condition);
      formDataToSend.append("addressText", formData.addressText.trim());

      const filteredRules = rules.filter((r) => r.trim() !== "");
      formDataToSend.append("rules", JSON.stringify(filteredRules));

      const coordinates = [
        parseFloat(formData.coordinates.lng) || 0,
        parseFloat(formData.coordinates.lat) || 0,
      ];
      formDataToSend.append("coordinates", JSON.stringify(coordinates));

      // Default availability: 1 year
      const availability = [
        {
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + 365 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      ];
      formDataToSend.append("availability", JSON.stringify(availability));

      images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      await itemService.createItem(formDataToSend);

      toast.success("Listing created successfully!");
      navigate("/lender/dashboard");
    } catch (error) {
      toast.error(error.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 text-gray-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center gap-4">
            <Link
              to="/lender/dashboard"
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-300" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Create New Listing
              </h1>
              <p className="text-gray-400 mt-1">
                Add an item available for rent in your community
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Basic Information */}
          <section className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-6 w-6 text-amber-500" />
              <h2 className="text-xl font-semibold text-white">
                Basic Information
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Title <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Professional Drone with 4K Camera"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Detailed description helps renters understand your item better..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Condition <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({ ...formData, condition: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  >
                    {CONDITIONS.map((cond) => (
                      <option key={cond} value={cond}>
                        {cond}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <DollarSign className="h-6 w-6 text-amber-500" />
              <h2 className="text-xl font-semibold text-white">Pricing</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Daily Price ($) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={formData.dailyPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, dailyPrice: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Security Deposit ($) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    placeholder="0.00"
                    value={formData.depositAmount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        depositAmount: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Images */}
          <section className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-7 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <ImageIcon className="h-6 w-6 text-amber-500" />
                <h2 className="text-xl font-semibold text-white">Images</h2>
              </div>
              <span className="text-sm text-gray-400">{images.length} / 5</span>
            </div>

            <div className="space-y-6">
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative rounded-xl overflow-hidden border border-gray-700 group aspect-square"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600/90 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-4 w-4" />
                      </button>
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-amber-600 text-white text-xs px-2.5 py-1 rounded font-medium">
                          Cover Image
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {images.length < 5 && (
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-700 rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer hover:border-amber-600 hover:bg-gray-800/30 transition-all">
                    <Upload className="h-10 w-10 text-gray-500 mb-3" />
                    <span className="text-gray-300 font-medium">
                      Click or drag to upload images
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      PNG, JPG, WEBP — up to 5 images
                    </span>
                  </div>
                </label>
              )}
            </div>
          </section>

          {/* Location */}
          <section className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="h-6 w-6 text-amber-500" />
              <h2 className="text-xl font-semibold text-white">Location</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Address <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 123 Main Street, Kathmandu 44600"
                  value={formData.addressText}
                  onChange={(e) =>
                    setFormData({ ...formData, addressText: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Latitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="27.7172"
                    value={formData.coordinates.lat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coordinates: {
                          ...formData.coordinates,
                          lat: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Longitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="85.3240"
                    value={formData.coordinates.lng}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        coordinates: {
                          ...formData.coordinates,
                          lng: e.target.value,
                        },
                      })
                    }
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Rental Rules */}
          <section className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <ListChecks className="h-6 w-6 text-amber-500" />
              <h2 className="text-xl font-semibold text-white">Rental Rules</h2>
            </div>

            <div className="space-y-4">
              {rules.map((rule, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="e.g., No smoking, No pets allowed"
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                  />
                  {rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="p-2.5 hover:bg-gray-800 rounded-lg transition"
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-red-400" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addRule}
                className="w-full py-3 border border-dashed border-gray-700 rounded-xl hover:border-amber-600 hover:bg-gray-800/30 transition-all flex items-center justify-center gap-2 text-gray-300"
              >
                <Plus className="h-5 w-5" />
                Add New Rule
              </button>
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6">
            <Link
              to="/lender/dashboard"
              className="px-8 py-3 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition text-center"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="px-10 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-900/30 min-w-[160px]"
            >
              <Save size={18} />
              {loading ? "Creating..." : "Create Listing"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
