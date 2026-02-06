// src/pages/lender/MyListingsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Calendar,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Plus,
  MoreVertical,
  Power,
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
    if (!window.confirm("Delete this listing permanently?")) return;

    try {
      await itemService.deleteItem(id);
      toast.success("Listing removed");
      setItems((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.message || "Could not delete listing");
    }
  };

  const handleToggleAvailability = async (item) => {
    try {
      const updatedData = { isAvailable: !item.isAvailable };
      await itemService.updateItem(item._id, updatedData);

      toast.success(
        item.isAvailable
          ? "Item is now unavailable"
          : "Item is now available for rent",
      );

      setItems((prev) =>
        prev.map((i) =>
          i._id === item._id ? { ...i, isAvailable: !i.isAvailable } : i,
        ),
      );
    } catch (error) {
      toast.error(error.message || "Could not update status");
    }
  };

  const baseUrl =
    import.meta.env.VITE_API_URL?.replace("/api", "") ||
    "http://localhost:5000";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 pt-12 pb-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-10">
            <div className="h-10 bg-gray-800/60 rounded-lg w-1/3" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden h-96"
                >
                  <div className="h-56 bg-gray-800/50" />
                  <div className="p-6 space-y-4">
                    <div className="h-7 bg-gray-800/60 rounded w-4/5" />
                    <div className="h-4 bg-gray-800/60 rounded w-full" />
                    <div className="h-4 bg-gray-800/60 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 text-gray-100 pt-10 pb-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 tracking-tight">
              My Inventory
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Manage your items available for rent
            </p>
          </div>

          <Link to="/lender/items/new">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-amber-700 hover:bg-amber-600 text-white font-medium rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:shadow-amber-900/30">
              <Plus size={18} />
              New Listing
            </button>
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-16 text-center">
            <div className="inline-block p-5 rounded-full bg-amber-950/30 mb-6">
              <Package className="h-16 w-16 text-amber-600/70" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-100 mb-4">
              Your inventory is empty
            </h3>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Start building your rental business by adding items you rarely
              use.
            </p>
            <Link to="/lender/items/new">
              <button className="px-8 py-4 bg-amber-700 hover:bg-amber-600 text-white rounded-xl text-lg font-medium transition-all hover:shadow-lg hover:shadow-amber-900/40">
                Create First Listing
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-8">
            {items.map((item) => (
              <div
                key={item._id}
                className="group bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:border-amber-800/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/40"
              >
                {/* Image + Status Badge */}
                <div className="relative h-64 sm:h-72">
                  {item.images?.[0] ? (
                    <img
                      src={`${baseUrl}${item.images[0]}`}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center bg-gray-950/70">
                      <Package className="h-24 w-24 text-gray-700" />
                    </div>
                  )}

                  <div className="absolute top-5 right-5">
                    <button
                      onClick={() => handleToggleAvailability(item)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm transition-all ${
                        item.isAvailable
                          ? "bg-emerald-900/70 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-800/70"
                          : "bg-rose-900/60 text-rose-300 border border-rose-800/50 hover:bg-rose-800/60"
                      }`}
                    >
                      <Power size={16} />
                      {item.isAvailable ? "Available" : "Unavailable"}
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed">
                    {item.description}
                  </p>

                  <div className="grid grid-cols-2 gap-5 mb-7 text-sm">
                    <div className="flex items-center gap-2.5">
                      <Package className="h-4.5 w-4.5 text-amber-600/80" />
                      <span className="text-gray-300">{item.category}</span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <DollarSign className="h-4.5 w-4.5 text-amber-600/80" />
                      <span className="font-semibold text-amber-400">
                        ${item.dailyPrice}
                        <span className="text-gray-500 font-normal"> /day</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <Calendar className="h-4.5 w-4.5 text-amber-600/80" />
                      <span className="text-gray-300">
                        Deposit:{" "}
                        <span className="text-amber-400 font-medium">
                          ${item.depositAmount}
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <Link to={`/lender/items/${item._id}/edit`}>
                      <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg text-gray-200 transition-colors">
                        <Edit size={16} />
                        Edit
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-red-900/50 text-red-300 hover:text-red-200 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
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
