// src/pages/lender/LenderProfilePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Star,
  MapPin,
  Calendar,
  Mail,
  Phone,
  Edit,
  ShieldCheck,
  User,
  Home,
} from "lucide-react";
import { toast } from "sonner";
import authService from "../../services/authService";
import itemService from "../../services/itemService";

export default function LenderProfilePage() {
  const [profile, setProfile] = useState(null);
  const [lenderStats, setLenderStats] = useState({
    totalItems: 0,
    activeListings: 0,
    estimatedRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    loadProfileAndStats();
  }, []);

  const loadProfileAndStats = async () => {
    try {
      setLoading(true);

      // 1. Get user profile
      const profileRes = await authService.getProfile();
      const user = profileRes.user || profileRes;
      setProfile(user);

      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });

      // 2. Get lender's items for stats
      const itemsRes = await itemService.getMyItems();
      const items = itemsRes.items || itemsRes || [];

      const active = items.filter((item) => item.isAvailable).length;

      // Very rough monthly estimate — you can improve this later with real bookings
      const estRevenue = items.reduce((sum, item) => {
        return sum + (item.dailyPrice || 0) * 10; // assume 10 rental days/month
      }, 0);

      setLenderStats({
        totalItems: items.length,
        activeListings: active,
        estimatedRevenue: estRevenue,
        averageRating: user.rating || 0,
        totalReviews: user.totalRatings || 0,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await authService.updateProfile(formData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      loadProfileAndStats();
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const profileImage = profile?.profilePicture
    ? `${import.meta.env.VITE_API_URL || "http://localhost:8000"}${
        profile.profilePicture
      }`
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading your profile...</p>
        </div>
      </div>
    );
  }
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back & Edit Button */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/lender/dashboard"
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium shadow-sm"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Cover + Avatar Section */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="absolute -bottom-16 left-6 md:left-10 flex items-end gap-6">
              <div className="relative">
                {profileImage ? (
                  <img
                    src={previewImage || `${BACKEND_URL}${user.profilePicture}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                    }}
                  />
                ) : null}

                {/* Fallback Avatar */}
                <div
                  className={`h-32 w-32 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-lg border-4 border-white ${
                    profileImage
                      ? "hidden"
                      : "bg-gradient-to-br from-blue-500 to-indigo-600"
                  }`}
                >
                  {profile?.firstName?.[0]?.toUpperCase()}
                  {profile?.lastName?.[0]?.toUpperCase()}
                </div>
              </div>

              <div className="pb-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">
                  {profile?.firstName} {profile?.lastName}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  {profile?.isVerified && (
                    <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white">
                      <ShieldCheck className="h-4 w-4" />
                      Verified Lender
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-yellow-300">
                    <Star className="h-5 w-5 fill-yellow-300" />
                    <span className="font-semibold">
                      {lenderStats.averageRating.toFixed(1)}
                    </span>
                    <span className="text-white/80 text-sm">
                      ({lenderStats.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-20 px-6 md:px-10 pb-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
              {[
                {
                  icon: Package,
                  label: "Total Listings",
                  value: lenderStats.totalItems,
                  color: "blue",
                },
                {
                  icon: Home,
                  label: "Active Now",
                  value: lenderStats.activeListings,
                  color: "green",
                },
                {
                  icon: DollarSign,
                  label: "Est. Monthly",
                  value: `$${lenderStats.estimatedRevenue.toFixed(0)}`,
                  color: "emerald",
                },
                {
                  icon: Star,
                  label: "Reviews",
                  value: lenderStats.totalReviews,
                  color: "amber",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center hover:shadow-sm transition-shadow"
                >
                  <stat.icon
                    className={`h-8 w-8 mx-auto mb-3 text-${stat.color}-600`}
                  />
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Edit Form or Display */}
            {isEditing ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 max-w-3xl mx-auto"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Edit Profile
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell renters about yourself and your items..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 font-medium shadow-sm"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                {/* About & Bio */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    About Me
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {profile?.bio ||
                      "No bio added yet. Adding a short description helps build trust with renters."}
                  </p>
                </div>

                {/* Contact & Location */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Contact & Location
                  </h3>
                  <div className="space-y-3 text-gray-700">
                    <p className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {profile?.email}
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {profile?.phone || "Not provided"}
                    </p>
                    <p className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      {profile?.address
                        ? `${profile.address.street || ""}, ${
                            profile.address.city || ""
                          }, ${profile.address.country || ""}`
                        : "No address added"}
                    </p>
                  </div>
                </div>

                {/* Account Info */}
                <div className="md:col-span-2 mt-4 pt-6 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-medium">
                        {new Date(profile?.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Status</p>
                      <p className="font-medium text-green-600 flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4" />
                        Active & Verified
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <p className="font-medium capitalize">{profile?.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              to: "/lender/items",
              icon: Package,
              color: "blue",
              title: "My Listings",
              desc: "Manage your items and availability",
            },
            {
              to: "/lender/bookings/requests",
              icon: Calendar,
              color: "orange",
              title: "Booking Requests",
              desc: "Review and respond to new requests",
            },
            {
              to: "/lender/bookings",
              icon: DollarSign,
              color: "emerald",
              title: "My Rentals",
              desc: "Track active and completed rentals",
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              to={item.to}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1 group"
            >
              <div
                className={`p-4 bg-${item.color}-50 rounded-lg inline-block mb-4 group-hover:bg-${item.color}-100 transition-colors`}
              >
                <item.icon className={`h-8 w-8 text-${item.color}-600`} />
              </div>
              <h4 className="font-semibold text-lg text-gray-900">
                {item.title}
              </h4>
              <p className="text-gray-600 mt-1">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
