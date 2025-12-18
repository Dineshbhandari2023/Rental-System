import api from "./api";

const itemService = {
  // Create a new item listing (with images)
  createItem: async (itemData) => {
    try {
      const response = await api.post("/items", itemData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create item" };
    }
  },

  // Get all items with optional filters (search, category, price, location, dates)
  getItems: async ({
    category,
    minPrice,
    maxPrice,
    lat,
    lng,
    maxDistance,
    startDate,
    endDate,
    search,
    page = 1,
    limit = 10,
  } = {}) => {
    try {
      const params = new URLSearchParams();
      if (category) params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (lat) params.append("lat", lat);
      if (lng) params.append("lng", lng);
      if (maxDistance) params.append("maxDistance", maxDistance);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (search) params.append("search", search);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      const response = await api.get(`/items?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch items" };
    }
  },

  // Get single item by ID
  getItemById: async (itemId) => {
    try {
      const response = await api.get(`/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Item not found" };
    }
  },

  // Update an existing item (with optional new images)
  updateItem: async (itemId, itemData) => {
    try {
      const response = await api.put(`/items/${itemId}`, itemData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to update item" };
    }
  },

  // Delete an item
  deleteItem: async (itemId) => {
    try {
      const response = await api.delete(`/items/${itemId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to delete item" };
    }
  },

  // Get user's own listed items (optional filters)
  getMyItems: async ({ page = 1, limit = 10, isAvailable } = {}) => {
    try {
      const params = new URLSearchParams();
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);
      if (isAvailable !== undefined) params.append("isAvailable", isAvailable);

      const response = await api.get(`/users/items?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to fetch your items" };
    }
  },
};

export default itemService;
