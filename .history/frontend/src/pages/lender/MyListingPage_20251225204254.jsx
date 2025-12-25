import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import itemService from "../../services/itemService";
import { toast } from "sonner";

export default function MyListingsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyItems();
  }, []);

  const loadMyItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getMyItems();
      const itemsData = response.items || response || [];
      setItems(itemsData);
    } catch (error) {
      toast.error(error.message || "Failed to load your listings");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this listing? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await itemService.deleteItem(id);
      toast.success("Listing deleted successfully");
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.message || "Failed to delete listing");
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const updatedData = { isAvailable: !item.isAvailable };
      await itemService.updateItem(item._id, updatedData);
      toast.success(
        `Item marked as ${
          updatedData.isAvailable ? "Available" : "Unavailable"
        }`
      );
      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id
            ? { ...i, isAvailable: updatedData.isAvailable }
            : i
        )
      );
    } catch (error) {
      toast.error(error.message || "Failed to update availability");
    }
  };

  const baseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:8000";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border p-6 animate-pulse"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="h-48 w-64 bg-gray-200 rounded-xl" />
                  <div className="flex-1 space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-3/4" />
                    <div className="h-20 bg-gray-200 rounded" />
                    <div className="flex gap-4">
                      <div className="h-8 bg-gray-200 rounded w-32" />
                      <div className="h-8 bg-gray-200 rounded w-32" />
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
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-2">
              Manage all your rental items in one place
            </p>
          </div>
          <Link to="/lender/items/new">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium">
              <Plus className="h-5 w-5" />
              Add New Listing
            </button>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-20 text-center">
            <Package className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              No listings yet
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start earning passive income by listing your unused items for
              rent.
            </p>
            <Link to="/lender/items/new">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium">
                Create Your First Listing
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-64 bg-gray-100">
                  {item.images?.[0] ? (
                    <img
                      src={`${baseUrl}${item.images[0]}`}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Package className="h-24 w-24 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                        item.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.isAvailable ? (
                        <ToggleRight className="h-5 w-5" />
                      ) : (
                        <ToggleLeft className="h-5 w-5" />
                      )}
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-5 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {item.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-gray-500" />
                      <span className="font-semibold text-lg">
                        ${item.dailyPrice}/day
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Deposit: ${item.depositAmount}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/items/${item._id}`}>
                      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        <Eye className="h-4 w-4" />
                        View Public
                      </button>
                    </Link>

                    <Link to={`/lender/items/${item._id}/edit`}>
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                    >
                      {item.isAvailable ? (
                        <ToggleLeft className="h-4 w-4" />
                      ) : (
                        <ToggleRight className="h-4 w-4" />
                      )}
                      Toggle Availability
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
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
