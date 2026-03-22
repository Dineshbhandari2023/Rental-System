import React, { useEffect, useState } from "react";
import {
  Plus,
  Package,
  DollarSign,
  Calendar,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import itemService from "../../services/itemService";

export default function LenderDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalItems: 0,
    activeListings: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getMyItems(); // Uses /users/items endpoint

      const itemsData = response.items || response; // Handle both { items } and direct array

      setItems(itemsData);

      // Estimate monthly revenue (dailyPrice * 30 days)
      const totalRevenue = itemsData.reduce(
        (sum, item) => sum + (Number(item.dailyPrice) || 0) * 30,
        0
      );

      setStats({
        totalItems: itemsData.length,
        activeListings: itemsData.filter((i) => i.isAvailable).length,
        totalRevenue,
      });
    } catch (error) {
      toast.error(error.message || "Failed to load your items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await itemService.deleteItem(id);
      toast.success("Item deleted successfully");
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.message || "Failed to delete item");
    }
  };

  const baseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:8000";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Lender Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your rental listings and track performance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Items"
            value={stats.totalItems}
            icon={<Package />}
          />
          <StatCard
            title="Active Listings"
            value={stats.activeListings}
            icon={<Calendar />}
          />
          <StatCard
            title="Est. Monthly Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon={<DollarSign />}
          />
        </div>

        {/* Listings */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b flex justify-between items-start flex-col sm:flex-row gap-4">
            <div>
              <h2 className="text-xl font-semibold">Your Listings</h2>
              <p className="text-gray-600 mt-1">
                Manage and edit your rental items
              </p>
            </div>
            <Link to="/lender/items/new">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Plus size={16} />
                Add New Listing
              </button>
            </Link>
          </div>

          <div className="p-6">
            {loading ? (
              <SkeletonList />
            ) : items.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="h-32 w-full sm:w-40 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                      {item.images?.[0] ? (
                        <img
                          src={`${baseUrl}${item.images[0]}`}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center">
                          <Package className="text-gray-400" size={40} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-3 items-center">
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              item.isAvailable
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </span>
                          <span className="text-sm text-gray-600">
                            {item.category}
                          </span>
                          <span className="font-semibold">
                            ${item.dailyPrice}/day
                          </span>
                        </div>
                      </div>

                      {/* Actions Dropdown */}
                      <div className="relative group">
                        <button className="p-2 rounded hover:bg-gray-200 transition">
                          <MoreVertical size={20} />
                        </button>
                        <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          <Link
                            to={`/items/${item._id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            <Eye size={14} /> View Public
                          </Link>
                          <Link
                            to={`/lender/items/${item._id}`}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            <Package size={14} /> View Details
                          </Link>
                          <Link
                            to={`/lender/items/${item._id}/edit`}
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            <Edit size={14} /> Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small Components remain the same */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm text-gray-600">{title}</p>
        <div className="text-gray-400">{icon}</div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-4 p-4 border rounded-lg animate-pulse">
          <div className="h-32 w-40 bg-gray-200 rounded" />
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16">
      <Package className="mx-auto h-16 w-16 text-gray-400" />
      <h3 className="mt-4 text-lg font-medium">No items listed yet</h3>
      <p className="text-gray-600 mt-2">
        Start earning by adding your first rental item
      </p>
      <Link to="/lender/items/new">
        <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
          Add Your First Item
        </button>
      </Link>
    </div>
  );
}
