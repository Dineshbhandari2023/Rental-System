import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import useFetch from "../../hooks/useFetch";
import {
  UserGroupIcon,
  ShieldCheckIcon,
  HomeIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

const StatCard = ({ title, value, icon: Icon, color = "amber" }) => (
  <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/40 rounded-2xl p-6 shadow-xl shadow-black/30 hover:border-amber-700/60 hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-amber-400/80 font-medium uppercase tracking-wider">
          {title}
        </p>
        <p className="mt-2 text-4xl font-serif font-bold text-amber-100">
          {value ?? "—"}
        </p>
      </div>
      <div className={`p-4 bg-${color}-950/40 rounded-xl`}>
        <Icon className={`h-8 w-8 text-${color}-400`} />
      </div>
    </div>
  </div>
);

const QuickActionCard = ({
  title,
  description,
  buttonText,
  buttonClass = "",
}) => (
  <div className="bg-gradient-to-br from-gray-900 to-gray-950 border border-amber-900/40 rounded-2xl p-6 shadow-xl shadow-black/30 hover:border-amber-700/60 hover:shadow-2xl hover:shadow-amber-900/20 transition-all duration-300 flex flex-col">
    <h3 className="text-xl font-serif font-semibold text-amber-200 mb-3">
      {title}
    </h3>
    <p className="text-amber-300/80 text-sm flex-1 mb-6">{description}</p>
    <button
      className={`px-6 py-3 rounded-lg font-medium transition-all ${buttonClass}`}
    >
      {buttonText}
    </button>
  </div>
);

const AdminDashboard = () => {
  const { data, loading } = useFetch("/admin/stats", []);
  const stats = data?.stats;

  return (
    <AdminLayout>
      <div className="space-y-10">
        {/* Header */}
        <div className="pb-8 border-b border-amber-900/30">
          <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent">
            Admin Control Center
          </h1>
          <p className="mt-3 text-lg text-amber-200/70 font-light tracking-wide">
            System overview • User management • Platform health
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-40 bg-gray-800/30 rounded-2xl animate-pulse border border-amber-900/20"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={stats?.totalUsers}
              icon={UserGroupIcon}
            />
            <StatCard
              title="Verified Users"
              value={stats?.verifiedUsers}
              icon={ShieldCheckIcon}
            />
            <StatCard
              title="Active Users"
              value={stats?.activeUsers}
              icon={HomeIcon}
            />
            <StatCard
              title="Verification Rate"
              value={stats?.verificationRate}
              icon={ChartBarIcon}
              color="emerald"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <QuickActionCard
            title="Send Announcement"
            description="Broadcast important updates or notices to all users."
            buttonText="Compose Message"
            buttonClass="bg-gradient-to-r from-amber-800 to-amber-900 hover:from-amber-700 hover:to-amber-800 text-amber-50 border border-amber-700/50 shadow-md shadow-amber-950/30"
          />

          <QuickActionCard
            title="Generate Report"
            description="Export platform performance and analytics."
            buttonText="Generate Now"
            buttonClass="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-amber-200 border border-amber-900/50"
          />

          <QuickActionCard
            title="System Health"
            description="Run diagnostics and check server status."
            buttonText="Run Check"
            buttonClass="bg-gradient-to-r from-emerald-900/60 to-emerald-800/60 hover:from-emerald-800/70 hover:to-emerald-700/70 text-emerald-200 border border-emerald-700/50"
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
