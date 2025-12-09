// import React from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import { Toaster } from "react-hot-toast";
// import { AuthProvider } from "./context/AuthContext";

// // Pages
// import Home from "./pages/Home";
// import LoginPage from "./pages/LoginPage";
// import RegisterPage from "./pages/RegisterPage";
// import Dashboard from "./pages/Dashboard";
// import AdminPage from "./pages/AdminPage";
// import Profile from "./pages/ProfilePage";

// // Components
// import ProtectedRoute from "./components/common/ProtectedRoute";

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-gray-50">
//           <Toaster
//             position="top-right"
//             toastOptions={{
//               duration: 4000,
//               style: {
//                 background: "#363636",
//                 color: "#fff",
//               },
//               success: {
//                 duration: 3000,
//                 theme: {
//                   primary: "green",
//                   secondary: "black",
//                 },
//               },
//             }}
//           />

//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home />} />
//             <Route path="/login" element={<LoginPage />} />
//             <Route path="/register" element={<RegisterPage />} />

//             {/* Protected Routes */}
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <Dashboard />
//                 </ProtectedRoute>
//               }
//             />

//             {/* Admin Routes */}
//             <Route
//               path="/admin"
//               element={
//                 <ProtectedRoute requireAdmin>
//                   <AdminPage />
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <Profile />
//                 </ProtectedRoute>
//               }
//             />
//             {/* Fallback Route */}
//             <Route path="*" element={<Navigate to="/" replace />} />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

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

// User pages
import Dashboard from "./pages/Dashboard";
import ProfilePage from "./pages/ProfilePage";

// Admin Pages (Style C)
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminVerifications from "./admin/pages/AdminVerifications";
import AdminTransactions from "./admin/pages/AdminTransactions";
import AdminDisputes from "./admin/pages/AdminDisputes";
import AdminContent from "./admin/pages/AdminContent";

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

            {/** ---------- USER PROTECTED ROUTES ---------- */}
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

            {/** ---------- ADMIN ROUTES (NEW FULL PANEL) ---------- */}
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

            {/** ---------- FALLBACK ---------- */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
