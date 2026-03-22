import api from "./api";

const adminService = {
  // Get all users (with pagination)
  getAllUsers: async ({ page = 1, limit = 10 }) => {
    const response = await api.get("/admin/users", {
      params: { page, limit },
    });
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/admin/users/${id}`);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/admin/users/${id}`, userData);
    return response.data;
  },

  // Delete (deactivate) user
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },

  // Verify user
  verifyUser: async (id, data = {}) => {
    const response = await api.put(`/admin/users/${id}/verify`, data);
    return response.data;
  },

  // Get dashboard stats
  getDashboardStats: async () => {
    const response = await api.get("/admin/stats");
    return response.data;
  },

  // Important methods your service should have

  verifyUser: async (id) => (await api.put(`/admin/users/${id}/verify`)).data,

  deactivateUser: async (id) =>
    (await api.put(`/admin/users/${id}/deactivate`)).data,

  activateUser: async (id) =>
    (await api.put(`/admin/users/${id}/activate`)).data,

  permanentDeleteUser: async (id) =>
    (await api.delete(`/admin/users/${id}/permanent`)).data,
};

export default adminService;
