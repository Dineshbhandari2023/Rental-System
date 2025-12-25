import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, X, Plus } from "lucide-react";
import { toast } from "sonner";
import itemService from "@/services/itemService";

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

const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];

export default function EditItemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [item, setItem] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
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

  useEffect(() => {
    if (id) loadItem(id);
  }, [id]);

  const loadItem = async (itemId) => {
    try {
      setLoading(true);
      const response = await itemService.getItemById(itemId);
      const data = response.item || response;

      setItem(data);

      setFormData({
        title: data.title || "",
        description: data.description || "",
        category: data.category || "",
        dailyPrice: data.dailyPrice?.toString() || "",
        depositAmount: data.depositAmount?.toString() || "",
        condition: data.condition || "Good",
        addressText: data.addressText || "",
        coordinates: {
          lat: data.location?.coordinates[1]?.toString() || "",
          lng: data.location?.coordinates[0]?.toString() || "",
        },
      });

      setRules(data.rules?.length > 0 ? data.rules : [""]);
    } catch (error) {
      toast.error(error.message || "Failed to load item");
      navigate("/lender/items");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const currentTotal = (item?.images?.length || 0) + newImages.length;

    if (files.length + currentTotal > 5) {
      toast.error("Maximum 5 images allowed in total");
      return;
    }

    setNewImages((prev) => [...prev, ...files]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
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
    if (!item) return;

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append text fields
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("dailyPrice", parseFloat(formData.dailyPrice) || 0);
      formDataToSend.append(
        "depositAmount",
        parseFloat(formData.depositAmount) || 0
      );
      formDataToSend.append("condition", formData.condition);
      formDataToSend.append("addressText", formData.addressText);

      // Append rules as JSON string
      const filteredRules = rules.filter((r) => r.trim() !== "");
      formDataToSend.append("rules", JSON.stringify(filteredRules));

      // Append coordinates as JSON string [lng, lat]
      const coordinates = [
        parseFloat(formData.coordinates.lng) || 0,
        parseFloat(formData.coordinates.lat) || 0,
      ];
      formDataToSend.append("coordinates", JSON.stringify(coordinates));

      // Append new images
      newImages.forEach((image) => {
        formDataToSend.append("images", image);
      });

      // Call your API to update
      await itemService.updateItem(item._id, formDataToSend);

      toast.success("Item updated successfully!");
      navigate(`/lender/items/${item._id}`);
    } catch (error) {
      toast.error(error.message || "Failed to update item");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item...</p>
        </div>
      </div>
    );
  }

  if (!item) return null;

  const baseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link to={`/lender/items/${item._id}`}>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <ArrowLeft size={24} />
              </button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Edit Listing</h1>
              <p className="text-gray-600">Update your rental item details</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData({ ...formData, condition: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
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
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.dailyPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, dailyPrice: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security Deposit ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.depositAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, depositAmount: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Images</h2>
            <div className="space-y-6">
              {/* Existing Images */}
              <div>
                <p className="text-sm text-gray-600 mb-3">Current Images</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {item.images.map((img, index) => (
                    <div
                      key={index}
                      className="relative rounded-lg overflow-hidden border"
                    >
                      <img
                        src={`${baseUrl}${img}`}
                        alt={`Image ${index + 1}`}
                        className="h-32 w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* New Images */}
              {newImagePreviews.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-3">New Images</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {newImagePreviews.map((preview, index) => (
                      <div
                        key={index}
                        className="relative rounded-lg overflow-hidden border group"
                      >
                        <img
                          src={preview}
                          alt={`New image ${index + 1}`}
                          className="h-32 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Area */}
              {item.images.length + newImages.length < 5 && (
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-xl h-40 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">
                      Upload new images ({item.images.length + newImages.length}
                      /5)
                    </span>
                  </div>
                </label>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.addressText}
                  onChange={(e) =>
                    setFormData({ ...formData, addressText: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
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
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude (optional)
                  </label>
                  <input
                    type="number"
                    step="any"
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
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rules */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-xl font-semibold mb-4">Rental Rules</h2>
            <div className="space-y-3">
              {rules.map((rule, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleRuleChange(index, e.target.value)}
                    placeholder="e.g., No smoking"
                    className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {rules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRule(index)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addRule}
                className="w-full py-2 border border-dashed rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600"
              >
                <Plus className="h-4 w-4" />
                Add Rule
              </button>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Link to={`/lender/items/${item._id}`}>
              <button
                type="button"
                className="px-6 py-3 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
