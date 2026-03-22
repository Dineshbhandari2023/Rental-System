import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Verifications from "../pages/admin/Verifications";
import Transactions from "../pages/admin/Transactions";
import Disputes from "../pages/admin/Disputes";
import Content from "../pages/admin/Content";
import Settings from "../pages/admin/Settings";

const AdminRoutes = () => (
  <Routes>
    <Route
      path="/admin"
      element={
        <ProtectedRoute requireAdmin>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute requireAdmin>
          <Users />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/verifications"
      element={
        <ProtectedRoute requireAdmin>
          <Verifications />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/transactions"
      element={
        <ProtectedRoute requireAdmin>
          <Transactions />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/disputes"
      element={
        <ProtectedRoute requireAdmin>
          <Disputes />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/content"
      element={
        <ProtectedRoute requireAdmin>
          <Content />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/settings"
      element={
        <ProtectedRoute requireAdmin>
          <Settings />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AdminRoutes;
