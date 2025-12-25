import api from "./api";

const bookingService = {
  // Create a new booking request (borrower)
  createBooking: async ({ itemId, startDate, endDate }) => {
    try {
      const response = await api.post("/bookings", {
        itemId,
        startDate,
        endDate,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to create booking" };
    }
  },

  // Get borrower's own bookings
  getMyBookings: async ({ status, page = 1, limit = 10 } = {}) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      const response = await api.get(
        `/bookings/my-bookings?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to fetch your bookings" }
      );
    }
  },

  // Get a single booking by ID (accessible by borrower or lender)
  getBookingById: async (bookingId) => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Booking not found" };
    }
  },

  // Cancel a booking (borrower only)
  cancelBooking: async (bookingId, { cancellationReason = "" } = {}) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/cancel`, {
        cancellationReason,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to cancel booking" };
    }
  },

  // Update booking status (lender only - e.g., confirm, complete)
  updateBookingStatus: async (bookingId, { status }) => {
    try {
      const response = await api.put(`/bookings/${bookingId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to update booking status" }
      );
    }
  },

  // Add this to your bookingService object
  getLenderBookingRequests: async ({
    status = "pending",
    page = 1,
    limit = 20,
  } = {}) => {
    try {
      const params = new URLSearchParams();
      params.append("status", status);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      const response = await api.get(
        `/bookings/lender/requests?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw (
        error.response?.data || { message: "Failed to load booking requests" }
      );
    }
  },
  // Add to bookingService
  getLenderBookings: async ({ status, page = 1, limit = 20 } = {}) => {
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (page) params.append("page", page);
      if (limit) params.append("limit", limit);

      const response = await api.get(
        `/bookings/lender/my-rentals?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: "Failed to load your rentals" };
    }
  },
};

export default bookingService;
