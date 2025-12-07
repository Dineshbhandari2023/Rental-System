import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authService.getToken();
        if (token && authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authService.login({ email, password });
      setUser(data.user);
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Login failed. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const data = await authService.register(userData);
      setUser(data.user);
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Registration failed. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setError(null);
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      setError(null);
      const data = await authService.updateProfile(userData);
      setUser(data.user);
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Update failed. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Update password function
  const updatePassword = async (passwordData) => {
    try {
      setError(null);
      const data = await authService.updatePassword(passwordData);
      return { success: true, data };
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Password update failed. Please try again.";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === "admin";
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    updatePassword,
    isAdmin,
    isAuthenticated: !!user,
    setError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
