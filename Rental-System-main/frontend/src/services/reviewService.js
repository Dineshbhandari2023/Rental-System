import api from "./api";

const reviewService = {
  createReview: async (reviewData) => {
    try {
      const response = await api.post("/reviews", reviewData);
      return response.data;
    } catch (error) {
      console.error("Error submitting review:", error);
      throw (
        error?.response?.data || {
          success: false,
          error: "Failed to submit review",
        }
      );
    }
  },

  getItemReviews: async (itemId, params = {}) => {
    try {
      const response = await api.get(`/reviews/item/${itemId}`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching item reviews:", error);
      throw (
        error?.response?.data || {
          success: false,
          error: "Failed to load item reviews",
        }
      );
    }
  },

  getUserReviews: async (userId, params = {}) => {
    try {
      const response = await api.get(`/reviews/user/${userId}`, {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...params,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching user reviews:", error);
      throw (
        error?.response?.data || {
          success: false,
          error: "Failed to load user reviews",
        }
      );
    }
  },

  submitBothReviews: async ({
    bookingId,
    rating,
    comment,
    reviewLender = true,
    reviewItem = true,
  }) => {
    const promises = [];

    if (reviewLender) {
      promises.push(
        reviewService.createReview({
          bookingId,
          type: "user_to_user",
          rating,
          comment,
        })
      );
    }

    if (reviewItem) {
      promises.push(
        reviewService.createReview({
          //   bookingId,
          type: "user_to_item",
          rating,
          comment,
          itemId: id,
        })
      );
    }

    if (promises.length === 0) {
      throw new Error("At least one review type must be selected");
    }

    const results = await Promise.allSettled(promises);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    if (rejected.length > 0) {
      console.warn("Some reviews failed:", rejected);
      // You might want to throw or return partial success
    }

    return {
      success: fulfilled.length > 0,
      results: fulfilled.map((r) => r.value),
      failed: rejected.map((r) => r.reason),
    };
  },
};

export default reviewService;
