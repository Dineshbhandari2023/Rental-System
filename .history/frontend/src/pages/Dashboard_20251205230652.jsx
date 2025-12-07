import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import Loader from "../components/common/Loader";
import Message from "../components/common/Message";
import {
  UserCircleIcon,
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Simulate API calls - Replace with actual API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock data - Replace with actual API data
        const mockStats = {
          totalItems: user?.role === "lender" ? 8 : 0,
          activeBookings: 3,
          completedBookings: 12,
          totalEarnings: user?.role === "lender" ? 1250 : 0,
          totalSpent: user?.role === "borrower" ? 450 : 0,
          averageRating: 4.8,
          pendingRequests: 2,
        };

        const mockActivity = [
          {
            id: 1,
            type: "booking",
            message: 'Your booking for "Power Drill" has been confirmed',
            time: "2 hours ago",
            status: "confirmed",
          },
          {
            id: 2,
            type: "message",
            message: 'New message from Sarah regarding "Camera Lens"',
            time: "1 day ago",
            status: "unread",
          },
          {
            id: 3,
            type: "review",
            message: "You received a 5-star review from John",
            time: "2 days ago",
            status: "positive",
          },
          {
            id: 4,
            type: "payment",
            message: 'Payment of $45 received for "Camping Tent"',
            time: "3 days ago",
            status: "completed",
          },
          {
            id: 5,
            type: "verification",
            message: "Your identity verification is complete",
            time: "1 week ago",
            status: "verified",
          },
        ];

        setStats(mockStats);
        setRecentActivity(mockActivity);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  const getWelcomeMessage = () => {
    const hours = new Date().getHours();
    let greeting = "Welcome back";

    if (hours < 12) greeting = "Good morning";
    else if (hours < 18) greeting = "Good afternoon";
    else greeting = "Good evening";

    return `${greeting}, ${user?.firstName || "there"}!`;
  };

  const getRoleStats = () => {
    if (user?.role === "lender" || user?.role === "both") {
      return [
        {
          label: "Items Listed",
          value: stats?.totalItems || 0,
          icon: ShoppingBagIcon,
          color: "bg-blue-500",
        },
        {
          label: "Total Earnings",
          value: `$${stats?.totalEarnings || 0}`,
          icon: CurrencyDollarIcon,
          color: "bg-green-500",
        },
        {
          label: "Avg. Rating",
          value: stats?.averageRating || 0,
          icon: StarIcon,
          color: "bg-yellow-500",
        },
        {
          label: "Pending Requests",
          value: stats?.pendingRequests || 0,
          icon: ClockIcon,
          color: "bg-purple-500",
        },
      ];
    } else if (user?.role === "borrower") {
      return [
        {
          label: "Active Rentals",
          value: stats?.activeBookings || 0,
          icon: ShoppingBagIcon,
          color: "bg-blue-500",
        },
        {
          label: "Total Spent",
          value: `$${stats?.totalSpent || 0}`,
          icon: CurrencyDollarIcon,
          color: "bg-green-500",
        },
        {
          label: "Completed Rentals",
          value: stats?.completedBookings || 0,
          icon: CheckCircleIcon,
          color: "bg-green-500",
        },
        {
          label: "Your Rating",
          value: stats?.averageRating || "New",
          icon: StarIcon,
          color: "bg-yellow-500",
        },
      ];
    }
    return [];
  };

  const getQuickActions = () => {
    const actions = [
      {
        label: "Browse Items",
        path: "/items",
        icon: ShoppingBagIcon,
        color: "bg-blue-100 text-blue-600",
      },
      {
        label: "My Bookings",
        path: "/bookings",
        icon: CalendarDaysIcon,
        color: "bg-green-100 text-green-600",
      },
      {
        label: "Messages",
        path: "/messages",
        icon: ChatBubbleLeftRightIcon,
        color: "bg-purple-100 text-purple-600",
      },
      {
        label: "My Profile",
        path: "/profile",
        icon: UserCircleIcon,
        color: "bg-orange-100 text-orange-600",
      },
    ];

    if (user?.role === "lender" || user?.role === "both") {
      actions.unshift({
        label: "List Item",
        path: "/items/new",
        icon: ShoppingBagIcon,
        color: "bg-primary-100 text-primary-600",
      });
    }

    return actions;
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {error && (
              <div className="mb-6">
                <Message
                  type="error"
                  message={error}
                  onClose={() => setError(null)}
                />
              </div>
            )}

            {/* Welcome Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {getWelcomeMessage()}
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Here's what's happening with your account today.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="flex items-center space-x-4">
                    {!user?.isVerified && (
                      <Link
                        to="/verify"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700"
                      >
                        <ShieldCheckIcon className="h-4 w-4 mr-2" />
                        Verify Account
                      </Link>
                    )}
                    <Link
                      to="/profile"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <UserCircleIcon className="h-4 w-4 mr-2" />
                      View Profile
                    </Link>
                  </div>
                </div>
              </div>

              {/* User Info Card */}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div className="card col-span-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center">
                        <UserCircleIcon className="h-8 w-8 text-primary-600" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </h3>
                      <div className="mt-1 flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {user?.role?.charAt(0).toUpperCase() +
                            user?.role?.slice(1)}
                        </span>
                        {user?.isVerified && (
                          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <ShieldCheckIcon className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        Member since{" "}
                        {new Date(user?.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Stats Cards */}
                {getRoleStats().map((stat, index) => (
                  <div key={index} className="card">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-12 w-12 rounded-lg ${stat.color} flex items-center justify-center`}
                      >
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-semibold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {getQuickActions().map((action) => (
                  <Link
                    key={action.label}
                    to={action.path}
                    className="card text-center hover:shadow-lg transition-shadow duration-300"
                  >
                    <div
                      className={`mx-auto h-12 w-12 rounded-full ${action.color} flex items-center justify-center`}
                    >
                      <action.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                      {action.label}
                    </h3>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2">
                <div className="card">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Recent Activity
                    </h2>
                    <Link
                      to="/activity"
                      className="text-sm font-medium text-primary-600 hover:text-primary-500"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start py-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex-shrink-0">
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              activity.status === "confirmed"
                                ? "bg-green-100"
                                : activity.status === "unread"
                                ? "bg-blue-100"
                                : activity.status === "positive"
                                ? "bg-yellow-100"
                                : activity.status === "completed"
                                ? "bg-purple-100"
                                : "bg-gray-100"
                            }`}
                          >
                            {activity.type === "booking" && (
                              <CalendarDaysIcon className="h-4 w-4 text-green-600" />
                            )}
                            {activity.type === "message" && (
                              <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-600" />
                            )}
                            {activity.type === "review" && (
                              <StarIcon className="h-4 w-4 text-yellow-600" />
                            )}
                            {activity.type === "payment" && (
                              <CurrencyDollarIcon className="h-4 w-4 text-purple-600" />
                            )}
                            {activity.type === "verification" && (
                              <ShieldCheckIcon className="h-4 w-4 text-gray-600" />
                            )}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <p className="text-sm text-gray-900">
                            {activity.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                        <ArrowRightIcon className="h-4 w-4 text-gray-400 ml-4" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Upcoming Bookings & Tips */}
              <div className="space-y-6">
                {/* Upcoming Bookings */}
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Upcoming Bookings
                  </h2>
                  <div className="space-y-3">
                    {[
                      {
                        id: 1,
                        item: "Camera Lens",
                        date: "Tomorrow, 2 PM",
                        status: "confirmed",
                      },
                      {
                        id: 2,
                        item: "Camping Tent",
                        date: "Oct 28, 10 AM",
                        status: "pending",
                      },
                    ].map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {booking.item}
                          </p>
                          <p className="text-xs text-gray-500">
                            {booking.date}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link
                    to="/bookings"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
                  >
                    View all bookings
                    <ArrowRightIcon className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                {/* Quick Tips */}
                <div className="card bg-primary-50 border-primary-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Quick Tips
                  </h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        Always verify the condition of items before accepting
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        Leave reviews to help build community trust
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircleIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                      <span className="text-sm text-gray-700">
                        Use the messaging system for all communications
                      </span>
                    </li>
                    {user?.role === "lender" && (
                      <li className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-primary-600 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700">
                          Take clear photos of items from multiple angles
                        </span>
                      </li>
                    )}
                  </ul>
                </div>

                {/* Admin Panel Link (if admin) */}
                {isAdmin() && (
                  <div className="card bg-indigo-50 border-indigo-200">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <ShieldCheckIcon className="h-8 w-8 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Admin Panel
                        </h3>
                        <p className="mt-1 text-sm text-gray-600">
                          Access administrative controls and user management
                        </p>
                        <Link
                          to="/admin"
                          className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Go to Admin Panel
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default Dashboard;
