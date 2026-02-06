// import React from "react";
// import AdminLayout from "../../components/layout/AdminLayout";
// import useFetch from "../../hooks/useFetch";
// import {
//   UserGroupIcon,
//   ShieldCheckIcon,
//   HomeIcon,
//   ChartBarIcon,
// } from "@heroicons/react/24/outline";

// const StatCard = ({ title, value, icon: Icon, color = "amber" }) => (
//   <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/40 rounded-2xl p-6 shadow-xl shadow-black/30 hover:border-amber-700/60 hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-300">
//     <div className="flex items-center justify-between">
//       <div>
//         <p className="text-sm text-amber-400/80 font-medium uppercase tracking-wider">
//           {title}
//         </p>
//         <p className="mt-2 text-4xl font-serif font-bold text-amber-100">
//           {value ?? "—"}
//         </p>
//       </div>
//       <div className={`p-4 bg-${color}-950/40 rounded-xl`}>
//         <Icon className={`h-8 w-8 text-${color}-400`} />
//       </div>
//     </div>
//   </div>
// );

// const QuickActionCard = ({
//   title,
//   description,
//   buttonText,
//   buttonClass = "",
// }) => (
//   <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/40 rounded-2xl p-6 shadow-xl shadow-black/30 hover:border-amber-700/60 hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-300 flex flex-col">
//     <h3 className="text-xl font-serif font-semibold text-amber-200 mb-3">
//       {title}
//     </h3>
//     <p className="text-amber-300/80 text-sm flex-1 mb-6">{description}</p>
//     <button
//       className={`px-6 py-3 rounded-lg font-medium transition-all ${buttonClass}`}
//     >
//       {buttonText}
//     </button>
//   </div>
// );

// const AdminDashboard = () => {
//   const { data, loading } = useFetch("/admin/stats", []);
//   const stats = data?.stats;

//   return (
//     <AdminLayout>
//       <div className="space-y-10">
//         {/* Header */}
//         <div className="pb-8 border-b border-amber-900/30">
//           <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent">
//             Admin Control Center
//           </h1>
//           <p className="mt-3 text-lg text-amber-200/70 font-light tracking-wide">
//             System overview • User management • Platform health
//           </p>
//         </div>
//         {/* Stats Grid */}
//         {loading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             {[...Array(4)].map((_, i) => (
//               <div
//                 key={i}
//                 className="h-40 bg-gray-800/30 rounded-2xl animate-pulse border border-amber-900/20"
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             <StatCard
//               title="Total Users"
//               value={stats?.totalUsers}
//               icon={UserGroupIcon}
//             />
//             <StatCard
//               title="Verified Users"
//               value={stats?.verifiedUsers}
//               icon={ShieldCheckIcon}
//             />
//             <StatCard
//               title="Active Users"
//               value={stats?.activeUsers}
//               icon={HomeIcon}
//             />
//             <StatCard
//               title="Verification Rate"
//               value={stats?.verificationRate}
//               icon={ChartBarIcon}
//               color="emerald"
//             />
//           </div>
//         )}
//         {/* Quick Actions
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <QuickActionCard
//             title="Send Announcement"
//             description="Broadcast important updates or notices to all users."
//             buttonText="Compose Message"
//             buttonClass="bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-amber-50 border border-amber-700/50 shadow-md shadow-amber-950/30"
//           />

//           <QuickActionCard
//             title="Generate Report"
//             description="Export platform performance and analytics."
//             buttonText="Generate Now"
//             buttonClass="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-amber-200 border border-amber-900/50"
//           />

//           <QuickActionCard
//             title="System Health"
//             description="Run diagnostics and check server status."
//             buttonText="Run Check"
//             buttonClass="bg-gradient-to-r from-emerald-900/60 to-emerald-800/60 hover:from-emerald-800/70 hover:to-emerald-700/70 text-emerald-200 border border-emerald-700/50"
//           />
//         </div> */}
//       </div>
//     </AdminLayout>
//   );
// };

// export default AdminDashboard;

// src/pages/admin/Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import useFetch from "../../hooks/useFetch";
import adminService from "../../services/adminService"; // ← your new adminService
import {
  UserGroupIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  UserMinusIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ title, value, icon: Icon, color = "amber", trend }) => (
  <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800/60 rounded-xl p-6 shadow-lg hover:border-amber-800/50 hover:shadow-amber-900/20 transition-all duration-300 group">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-400 font-medium uppercase tracking-wide">
          {title}
        </p>
        <p className="mt-3 text-3xl md:text-4xl font-bold text-white">
          {value ?? "—"}
        </p>
        {trend && (
          <p
            className={`mt-1 text-xs ${
              trend.startsWith("+") ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {trend} this month
          </p>
        )}
      </div>
      <div
        className={`p-3 bg-${color}-950/30 rounded-lg group-hover:bg-${color}-900/40 transition-colors`}
      >
        <Icon className={`h-7 w-7 text-${color}-400`} />
      </div>
    </div>
  </div>
);

const QuickActionButton = ({
  icon: Icon,
  label,
  description,
  onClick,
  variant = "default",
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 border-amber-600/50 text-white",
    danger:
      "bg-gradient-to-r from-rose-900/80 to-rose-800 hover:from-rose-800 hover:to-rose-700 border-rose-700/50 text-rose-100",
    success:
      "bg-gradient-to-r from-emerald-900/80 to-emerald-800 hover:from-emerald-800 hover:to-emerald-700 border-emerald-700/50 text-emerald-100",
    neutral:
      "bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border-gray-700 text-gray-200",
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start p-5 rounded-xl border shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${variants[variant]}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon className="h-6 w-6" />
        <span className="font-semibold text-lg">{label}</span>
      </div>
      <p className="text-sm opacity-80">{description}</p>
    </button>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = useFetch("/admin/stats");
  const stats = data?.stats || {};

  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  // Example: quick delete (you would usually have a users list page)
  const handleDeleteUser = async (userId) => {
    if (!userId) return;
    if (!window.confirm("Are you sure you want to deactivate this user?"))
      return;

    try {
      await adminService.deleteUser(userId);
      alert("User deactivated successfully");
      refetch(); // refresh stats if needed
    } catch (err) {
      alert(
        "Failed to deactivate user: " +
          (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-10 pb-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-lg text-gray-300">
              Monitor • Manage • Moderate
            </p>
          </div>
          <button
            onClick={refetch}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-200 transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
            Refresh
          </button>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-44 bg-gray-800/40 rounded-xl animate-pulse border border-gray-700/50"
              />
            ))}
          </div>
        ) : error ? (
          <div className="bg-rose-950/40 border border-rose-800/50 rounded-xl p-6 text-rose-200">
            Failed to load statistics. Please try again later.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={UserGroupIcon}
            />
            <StatCard
              title="Verified Users"
              value={stats.verifiedUsers}
              icon={ShieldCheckIcon}
              color="emerald"
            />
            <StatCard
              title="Active Users"
              value={stats.activeUsers}
              icon={UserPlusIcon}
              color="cyan"
            />
            <StatCard
              title="Verification Rate"
              value={
                stats.verificationRate ? `${stats.verificationRate}%` : "—"
              }
              icon={CheckCircleIcon}
              color="emerald"
              trend="+4.2%"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-amber-100 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <QuickActionButton
              icon={UserGroupIcon}
              label="Manage Users"
              description="View, search, edit roles, verify or deactivate accounts"
              variant="primary"
              onClick={() => navigate("/admin/users")}
            />

            <QuickActionButton
              icon={ShieldCheckIcon}
              label="Verification Requests"
              description="Review pending ID/address proofs (coming soon)"
              variant="success"
              onClick={() =>
                alert("Verification queue page - under development")
              }
            />

            <QuickActionButton
              icon={UserMinusIcon}
              label="Deactivate User"
              description="Quickly suspend problematic accounts"
              variant="danger"
              onClick={() => {
                const id = prompt("Enter User ID to deactivate:");
                if (id) handleDeleteUser(id);
              }}
            />

            <QuickActionButton
              icon={ExclamationTriangleIcon}
              label="Disputes"
              description="Review open payment/item disputes"
              variant="neutral"
              onClick={() => navigate("/admin/disputes")}
            />

            <QuickActionButton
              icon={CheckCircleIcon}
              label="Grant Admin Rights"
              description="Promote user to admin role"
              variant="neutral"
              onClick={() => alert("Admin promotion flow - under development")}
            />

            <QuickActionButton
              icon={ArrowPathIcon}
              label="Refresh Stats"
              description="Force reload dashboard statistics"
              variant="neutral"
              onClick={refetch}
            />
          </div>
        </div>

        {/* Placeholder for Pending Verifications */}
        <div className="mt-12 bg-gray-900/60 border border-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-amber-100 mb-4 flex items-center gap-3">
            <ShieldCheckIcon className="h-6 w-6 text-amber-400" />
            Pending Verification Requests
          </h3>
          <p className="text-gray-400 mb-6">
            No pending verification requests at the moment.
            {/* When you implement real data → show table or cards here */}
          </p>
          <button
            className="px-5 py-2.5 bg-amber-800/70 hover:bg-amber-700 border border-amber-700/50 rounded-lg text-amber-100 transition-colors"
            onClick={() => alert("Verification list page - coming soon")}
          >
            View All Requests
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
