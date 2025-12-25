import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

// Public pages
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import PageNotFound from "./NotFound";

// User pages
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminVerifications from "./pages/admin/Verifications";
import AdminTransactions from "./pages/admin/Transactions";
import AdminDisputes from "./pages/admin/Disputes";
import AdminContent from "./pages/admin/Content";

// Lender pages
import LenderLayout from "./pages/lender/LenderLayout";
import LenderDashboard from "./pages/lender/LenderDashboard";
import NewItemPage from "./pages/lender/NewItemPage";
import ItemDetailsPage from "./pages/lender/ItemDetailsPage"; // Lender view
import EditItemPage from "./pages/lender/EditItemPage";
import HomePage from "./pages/lender/HomePage"; // Optional lender home
import BookingsRequestsPage from "./pages/lender/BookingsRequestsPage";
import MyBookingsPage from "./pages/lender/MyBookingsPage";
import MyListingsPage from "./pages/lender/MyListingPage";
import LenderProfilePage from "./pages/lender/LenderProfilePage";

// Borrower pages
import BorrowerLayout from "./pages/borrower/BorrowerLayout";
import BorrowerDashboard from "./pages/borrower/BorrowerDashboard";
import BrowseItems from "./pages/borrower/BrowseItems";
import ItemDetail from "./pages/borrower/ItemDetail";
import MyBookings from "./pages/borrower/MyBookings";
import BookingDetail from "./pages/borrower/BookingDetail";

// Common
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: "#363636", color: "#fff" },
            }}
          />

          <Routes>
            {/** ---------- PUBLIC ROUTES ---------- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/** ---------- GENERAL USER PROTECTED ROUTES ---------- */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/** ---------- ADMIN ROUTES ---------- */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/verifications"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminVerifications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/transactions"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminTransactions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/disputes"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDisputes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/content"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminContent />
                </ProtectedRoute>
              }
            />

            {/** ---------- LENDER ROUTES (with shared layout) ---------- */}
            <Route element={<LenderLayout />}>
              <Route path="/lender/home" element={<HomePage />} />
              <Route path="/lender/dashboard" element={<LenderDashboard />} />
              <Route path="/lender/items/new" element={<NewItemPage />} />
              <Route path="/lender/items/:id" element={<ItemDetailsPage />} />
              <Route path="/lender/items/:id/edit" element={<EditItemPage />} />
              <Route path="/lender/item" element={<MyListingsPage />} />
              <Route
                path="/lender/bookings/requests"
                element={<BookingsRequestsPage />}
              />
              <Route path="/lender/booking" element={<MyBookingsPage />} />
              <Route path="/lender/profile" element={<LenderProfilePage />} />
            </Route>

            {/** ---------- BORROWER ROUTES (NEW - with shared layout) ---------- */}
            <Route element={<BorrowerLayout />}>
              <Route
                path="/borrower/dashboard"
                element={<BorrowerDashboard />}
              />
              <Route path="/borrower/browse" element={<BrowseItems />} />
              <Route path="/borrower/bookings" element={<MyBookings />} />
              <Route
                path="/borrower/bookings/:id"
                element={<BookingDetail />}
              />
            </Route>

            {/** ---------- PUBLIC ITEM DETAIL (for borrowers to view & book) ---------- */}
            {/* This route is public so anyone can view items and book */}
            <Route path="/items/:id" element={<ItemDetail />} />

            {/** ---------- FALLBACK & 404 ---------- */}
            <Route path="/not-found" element={<PageNotFound />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
