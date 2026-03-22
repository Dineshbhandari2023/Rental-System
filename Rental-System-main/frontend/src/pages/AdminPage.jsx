import React from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import {
  ShieldCheckIcon,
  UserGroupIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  DocumentCheckIcon,
  CreditCardIcon,
} from "@heroicons/react/24/outline";

const AdminPage = () => {
  const { user } = useAuth();

  const adminCards = [
    {
      title: "User Management",
      description: "View, verify, and manage all users",
      icon: UserGroupIcon,
      link: "/admin/users",
      count: 156,
      color: "bg-blue-500",
    },
    {
      title: "Verification Requests",
      description: "Review pending user verifications",
      icon: ShieldCheckIcon,
      link: "/admin/verifications",
      count: 12,
      color: "bg-green-500",
    },
    {
      title: "Dispute Resolution",
      description: "Handle user disputes and conflicts",
      icon: ExclamationTriangleIcon,
      link: "/admin/disputes",
      count: 3,
      color: "bg-yellow-500",
    },
    {
      title: "Transaction Monitoring",
      description: "Monitor all platform transactions",
      icon: CreditCardIcon,
      link: "/admin/transactions",
      count: 245,
      color: "bg-purple-500",
    },
    {
      title: "Content Moderation",
      description: "Review and manage item listings",
      icon: DocumentCheckIcon,
      link: "/admin/content",
      count: 8,
      color: "bg-pink-500",
    },
    {
      title: "Analytics Dashboard",
      description: "View platform statistics and reports",
      icon: ChartBarIcon,
      link: "/admin/analytics",
      count: null,
      color: "bg-indigo-500",
    },
  ];

  return (
    <ProtectedRoute requireAdmin>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Welcome back, {user?.firstName}. Manage the platform and ensure
                smooth operations.
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {[
                { label: "Total Users", value: "1,256", change: "+12%" },
                { label: "Active Listings", value: "342", change: "+5%" },
                { label: "Today's Transactions", value: "48", change: "+23%" },
                { label: "Open Disputes", value: "7", change: "-2" },
              ].map((stat, index) => (
                <div key={index} className="card">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <div className="mt-2 flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`ml-2 text-sm font-medium ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Cards */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {adminCards.map((card) => (
                <div
                  key={card.title}
                  className="card hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-center">
                    <div
                      className={`flex-shrink-0 h-12 w-12 rounded-lg ${card.color} flex items-center justify-center`}
                    >
                      <card.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        {card.description}
                      </p>
                      {card.count !== null && (
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                            {card.count}
                          </span>
                          <a
                            href={card.link}
                            className="text-sm font-medium text-primary-600 hover:text-primary-500"
                          >
                            View details →
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Admin Activity */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {[
                    {
                      action: "Verified user",
                      user: "John Doe",
                      time: "10 min ago",
                    },
                    {
                      action: "Resolved dispute",
                      user: "Sarah Smith",
                      time: "1 hour ago",
                    },
                    {
                      action: "Removed listing",
                      user: "Mike Johnson",
                      time: "3 hours ago",
                    },
                    {
                      action: "Updated system settings",
                      user: "System",
                      time: "Yesterday",
                    },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center py-2 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <ShieldCheckIcon className="h-4 w-4 text-gray-600" />
                        </div>
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-medium">{activity.action}</span>{" "}
                          • {activity.user}
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Send Platform Announcement
                        </p>
                        <p className="text-xs text-gray-500">
                          Notify all users about updates
                        </p>
                      </div>
                      <span className="text-primary-600">→</span>
                    </div>
                  </button>
                  <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Generate Monthly Report
                        </p>
                        <p className="text-xs text-gray-500">
                          Create platform performance report
                        </p>
                      </div>
                      <span className="text-primary-600">→</span>
                    </div>
                  </button>
                  <button className="w-full text-left px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          System Health Check
                        </p>
                        <p className="text-xs text-gray-500">
                          Monitor server status and performance
                        </p>
                      </div>
                      <span className="text-primary-600">→</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Important Notices */}
            <div className="mt-8 card bg-yellow-50 border-yellow-200">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    System Notices
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      • Server maintenance scheduled for Sunday, 2 AM - 4 AM
                    </p>
                    <p>• New verification documents pending: 5</p>
                    <p>• System backup completed successfully</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default AdminPage;
