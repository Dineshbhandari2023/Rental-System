import React, { useState, useEffect } from "react";
import { Search, Filter, Package } from "lucide-react";
import itemService from "../../services/itemService";
import { toast } from "sonner";
import { Link } from "react-router-dom";

export default function BrowseItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    // Add location later with geolocation
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 0,
  });
  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");

  useEffect(() => {
    searchItems();
  }, [filters, pagination.page]);

  const searchItems = async () => {
    try {
      setLoading(true);
      const response = await itemService.getItems({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setItems(response.items || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages || 1,
      }));
    } catch (error) {
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };
  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };
  function Carousel({ images, title }) {
    const [index, setIndex] = useState(0);

    if (!images || images.length === 0) {
      return (
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
      );
    }

    const next = (e) => {
      e.preventDefault();
      setIndex((i) => (i + 1) % images.length);
    };

    const prev = (e) => {
      e.preventDefault();
      setIndex((i) => (i - 1 + images.length) % images.length);
    };

    return (
      <div className="relative h-full w-full">
        <img
          src={getImageUrl(images[index])}
          alt={title}
          className="h-full w-full object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full text-sm"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full text-sm"
            >
              ›
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Rentals</h1>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                name="search"
                placeholder="Search items..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Categories</option>
              {/* Add categories from constant */}
              {[
                "Tools",
                "Electronics",
                "Books",
                "Sports",
                "Home & Garden",
                "Vehicles",
                "Clothing",
                "Furniture",
                "Other",
              ].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <input
              name="minPrice"
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-32 px-4 py-2 border rounded-lg"
            />
            <input
              name="maxPrice"
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-32 px-4 py-2 border rounded-lg"
            />
            <button
              onClick={searchItems}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
            >
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-600">No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Link
                key={item._id}
                to={`/items/${item._id}`}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <Carousel images={item.images} title={item.title} />
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="font-bold">${item.dailyPrice}/day</span>
                    <span className="text-sm text-gray-500">
                      {item.category}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            <button
              disabled={pagination.page === 1}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={pagination.page === pagination.totalPages}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              className="px-4 py-2 border rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
