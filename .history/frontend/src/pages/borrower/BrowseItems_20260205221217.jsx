// BrowseItems.jsx
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Package,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
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
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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
      toast.error(err.message || "Failed to load items");
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

  // Carousel component (unchanged but improved slightly)
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
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-amber-100 p-2.5 rounded-full opacity-0 group-hover:opacity-90 transition-opacity hover:bg-black/70"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm text-amber-100 p-2.5 rounded-full opacity-0 group-hover:opacity-90 transition-opacity hover:bg-black/70"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === index ? "bg-amber-400 scale-125" : "bg-amber-900/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100">
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row">
        {/* Left Sidebar – Filters */}
        <aside
          className={`
          lg:w-80 xl:w-96 lg:border-r lg:border-amber-900/40 lg:bg-gradient-to-b lg:from-gray-950 lg:to-gray-900
          fixed lg:sticky lg:top-0 lg:h-screen overflow-y-auto z-40
          w-full bg-gray-950 border-b border-amber-900/40 lg:border-b-0
          transition-transform duration-300 lg:translate-x-0
          ${showMobileFilters ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between lg:hidden mb-6">
              <h2 className="text-2xl font-serif font-semibold text-amber-200">
                Filters
              </h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 rounded-lg hover:bg-amber-900/30 text-amber-300"
              >
                <X size={24} />
              </button>
            </div>

            <h2 className="hidden lg:block text-2xl font-serif font-semibold text-amber-200 mb-8">
              Refine Search
            </h2>

            {/* Search Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-amber-300/90 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-600/70" />
                <input
                  name="search"
                  placeholder="Item name, keyword..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800/60 border border-amber-900/50 rounded-lg text-amber-100 placeholder-amber-500/70 focus:outline-none focus:border-amber-600 transition-colors"
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-amber-300/90 mb-2">
                Category
              </label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-gray-800/60 border border-amber-900/50 rounded-lg text-amber-100 focus:outline-none focus:border-amber-600 transition-colors"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-amber-300/90 mb-2">
                Daily Price Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    name="minPrice"
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 bg-gray-800/60 border border-amber-900/50 rounded-lg text-amber-100 placeholder-amber-500/70 focus:outline-none focus:border-amber-600 transition-colors"
                  />
                </div>
                <div>
                  <input
                    name="maxPrice"
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-3 bg-gray-800/60 border border-amber-900/50 rounded-lg text-amber-100 placeholder-amber-500/70 focus:outline-none focus:border-amber-600 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Apply Filters Button (mobile only) */}
            <button
              onClick={() => {
                searchItems();
                setShowMobileFilters(false);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-amber-800 to-amber-900 text-amber-50 font-medium rounded-lg flex items-center justify-center gap-2 lg:hidden"
            >
              <Filter size={18} /> Apply Filters
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile filter toggle */}
          <div className="lg:hidden sticky top-0 z-30 bg-gray-950/90 backdrop-blur-md border-b border-amber-900/40">
            <div className="px-4 py-4 flex items-center justify-between">
              <h1 className="text-xl font-serif font-semibold text-amber-200">
                Browse Items
              </h1>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-900/30 rounded-lg text-amber-200 hover:bg-amber-800/40"
              >
                <SlidersHorizontal size={18} />
                Filters
              </button>
            </div>
          </div>

          {/* Desktop page title */}
          <div className="hidden lg:block p-8 pb-4 border-b border-amber-900/30">
            <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent">
              Available Items
            </h1>
            <p className="mt-2 text-amber-300/80">
              Discover what your community is sharing today
            </p>
          </div>

          {/* Items Grid */}
          <div className="p-4 md:p-6 lg:p-8">
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
                  No matching items
                </h3>
                <p className="text-amber-300/70 max-w-md mx-auto">
                  Try changing filters or search terms
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <Link
                      key={item._id}
                      to={`/items/${item._id}`}
                      className="group bg-gradient-to-b from-gray-900 to-gray-950 border border-amber-900/30 rounded-xl overflow-hidden hover:border-amber-700/60 hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-300 flex flex-col"
                    >
                      <ItemImageCarousel
                        images={item.images}
                        title={item.title}
                      />

                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="font-serif font-semibold text-lg text-amber-100 group-hover:text-amber-50 line-clamp-2 min-h-[3rem]">
                          {item.title}
                        </h3>

                        <p className="mt-3 text-sm text-amber-300/70 line-clamp-3 flex-1">
                          {item.description}
                        </p>

                        <div className="mt-5 pt-4 border-t border-amber-900/30 flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-amber-200">
                              ${item.dailyPrice}
                            </span>
                            <span className="text-sm text-amber-400/80">
                              /day
                            </span>
                          </div>
                          <span className="text-sm px-3 py-1 bg-amber-950/50 rounded-full text-amber-300/90 border border-amber-900/40">
                            {item.category}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-12 pt-8 border-t border-amber-900/30">
                    <div className="text-amber-300/80 text-sm">
                      Showing {(pagination.page - 1) * pagination.limit + 1}–
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.totalItems
                      )}{" "}
                      of {pagination.totalItems}
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

                      <span className="px-6 py-3 bg-amber-900/30 rounded-lg font-medium text-amber-200 min-w-[140px] text-center">
                        Page {pagination.page} / {pagination.totalPages}
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
        </main>
      </div>
    </div>
  );
}
