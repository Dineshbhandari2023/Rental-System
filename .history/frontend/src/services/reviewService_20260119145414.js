import api from "./api";

const reviewService = {
  /**
   * Submit a review for a completed booking
   * @param {Object} reviewData
   * @param {"user_to_user" | "user_to_item"} reviewData.type
   * @param {string} reviewData.bookingId
   * @param {number} reviewData.rating       // 1–5
   * @param {string} reviewData.comment
   */
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

  /**
   * Get all reviews written about a specific item
   * @param {string} itemId
   * @param {Object} [params] - query params
   * @param {number} [params.page=1]
   * @param {number} [params.limit=10]
   */
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

  /**
   * Get all reviews received by a specific user (usually a lender)
   * @param {string} userId
   * @param {Object} [params] - query params
   * @param {number} [params.page=1]
   * @param {number} [params.limit=10]
   */
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

  /**
   * Convenience method: Submit review for both lender and item at once
   * (you can call this if your UI allows reviewing both in one form)
   */
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
          bookingId,
          type: "user_to_item",
          rating,
          comment,
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
