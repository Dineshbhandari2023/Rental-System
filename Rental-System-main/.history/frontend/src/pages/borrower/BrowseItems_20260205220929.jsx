// BrowseItems.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import itemService from "../../services/itemService";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const CATEGORIES = [
  "Tools",
  "Electronics",
  "Books",
  "Sports",
  "Home & Garden",
  "Vehicles",
  "Clothing",
  "Furniture",
  "Other",
];

export default function BrowseItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    minPrice: "",
    maxPrice: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    totalPages: 1,
    totalItems: 0,
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "";

  useEffect(() => {
    searchItems();
  }, [filters, pagination.page]);

  const searchItems = async () => {
    try {
      setLoading(true);
      const query = {
        search: filters.search.trim() || undefined,
        category: filters.category || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
        page: pagination.page,
        limit: pagination.limit,
      };

      const response = await itemService.getItems(query);

      setItems(response.items || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.totalPages || 1,
        totalItems: response.total || 0,
      }));
    } catch (err) {
      toast.error(err.message || "Failed to load available items");
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
    if (!path) return "https://via.placeholder.com/400x300?text=No+Image";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

  // Simple inline carousel (no external library)
  function ItemImageCarousel({ images, title }) {
    const [index, setIndex] = useState(0);

    if (!images?.length) {
      return (
        <div className="h-64 bg-gray-800/40 flex items-center justify-center border-b border-amber-900/30">
          <Package className="h-12 w-12 text-amber-800/60" />
        </div>
      );
    }

    const next = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIndex((i) => (i + 1) % images.length);
    };

    const prev = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIndex((i) => (i - 1 + images.length) % images.length);
    };

    return (
      <div className="relative h-64 w-full overflow-hidden group">
        <img
          src={getImageUrl(images[index])}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-amber-100 p-2 rounded-full opacity-0 group-hover:opacity-80 transition-opacity hover:bg-black/60"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-sm text-amber-100 p-2 rounded-full opacity-0 group-hover:opacity-80 transition-opacity hover:bg-black/60"
            >
              <ChevronRight size={20} />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === index ? "bg-amber-400" : "bg-amber-900/60"
                  } transition-all duration-300`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-100 px-4 py-8 md:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 pb-6 border-b border-amber-900/30">
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent">
            Available Treasures
          </h1>
          <p className="mt-3 text-lg text-amber-200/70 font-light tracking-wide">
            Discover items your neighbors are sharing right now
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/40 rounded-xl p-6 mb-12 shadow-xl shadow-black/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative col-span-1 lg:col-span-2">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600/70" />
              <input
                name="search"
                placeholder="Search by name or keyword..."
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/60 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-500/60 focus:outline-none focus:border-amber-600/70 transition-colors"
              />
            </div>

            {/* Category */}
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="px-4 py-3 bg-gray-800/60 border border-amber-900/40 rounded-lg text-amber-100 focus:outline-none focus:border-amber-600/70 transition-colors"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Min Price */}
            <input
              name="minPrice"
              type="number"
              placeholder="Min $/day"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="px-4 py-3 bg-gray-800/60 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-500/60 focus:outline-none focus:border-amber-600/70 transition-colors"
            />

            {/* Max Price */}
            <input
              name="maxPrice"
              type="number"
              placeholder="Max $/day"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="px-4 py-3 bg-gray-800/60 border border-amber-900/40 rounded-lg text-amber-100 placeholder-amber-500/60 focus:outline-none focus:border-amber-600/70 transition-colors"
            />

            {/* Filter Button */}
            <button
              onClick={searchItems}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-amber-800 to-amber-900 text-amber-50 font-medium rounded-lg flex items-center justify-center gap-2 hover:from-amber-700 hover:to-amber-800 transition-all shadow-md shadow-amber-950/40 disabled:opacity-60"
            >
              <Filter size={18} />
              Filter
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-96 bg-gray-800/30 rounded-xl animate-pulse border border-amber-900/20"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24">
            <Package className="mx-auto h-16 w-16 text-amber-800/60 mb-6" />
            <h3 className="text-2xl font-serif text-amber-200 mb-3">
              No items found
            </h3>
            <p className="text-amber-300/70 max-w-md mx-auto">
              Try adjusting your filters or browse other categories
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {items.map((item) => (
                <Link
                  key={item._id}
                  to={`/items/${item._id}`}
                  className="group bg-gradient-to-b from-gray-900 to-gray-950 border border-amber-900/30 rounded-xl overflow-hidden hover:border-amber-700/60 hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-300 flex flex-col"
                >
                  <ItemImageCarousel images={item.images} title={item.title} />

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-serif font-semibold text-lg text-amber-100 group-hover:text-amber-50 line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm text-amber-300/70 line-clamp-2 flex-1">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between border-t border-amber-900/30 pt-4">
                      <div>
                        <span className="text-xl font-bold text-amber-200">
                          ${item.dailyPrice}
                        </span>
                        <span className="text-sm text-amber-400/80"> /day</span>
                      </div>
                      <span className="text-sm px-3 py-1 bg-amber-950/40 rounded-full text-amber-300/90 border border-amber-900/40">
                        {item.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-amber-900/30 pt-8">
                <div className="text-amber-300/80">
                  Showing {(pagination.page - 1) * pagination.limit + 1}–
                  {Math.min(
                    pagination.page * pagination.limit,
                    pagination.totalItems
                  )}{" "}
                  of {pagination.totalItems} items
                </div>

                <div className="flex items-center gap-3">
                  <button
                    disabled={pagination.page === 1}
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page - 1 }))
                    }
                    className="p-3 rounded-lg bg-gray-800/60 border border-amber-900/40 text-amber-300 hover:bg-gray-700/60 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <span className="px-5 py-2.5 bg-amber-900/30 rounded-lg font-medium text-amber-200">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>

                  <button
                    disabled={pagination.page === pagination.totalPages}
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page + 1 }))
                    }
                    className="p-3 rounded-lg bg-gray-800/60 border border-amber-900/40 text-amber-300 hover:bg-gray-700/60 disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
