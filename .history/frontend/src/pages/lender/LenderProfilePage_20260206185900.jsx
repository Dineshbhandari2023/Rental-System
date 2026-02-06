// src/pages/lender/LenderProfilePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Package,
  DollarSign,
  Star,
  MapPin,
  Mail,
  Phone,
  Edit,
  ShieldCheck,
  User,
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

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    loadProfileAndStats();
  }, []);

  const loadProfileAndStats = async () => {
    try {
      setLoading(true);

      const profileRes = await authService.getProfile();
      const user = profileRes.user || profileRes;
      setProfile(user);

      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        bio: user.bio || "",
      });

      const itemsRes = await itemService.getMyItems();
      const items = itemsRes.items || itemsRes || [];

      const active = items.filter((i) => i.isAvailable).length;
      const estRevenue = items.reduce(
        (sum, i) => sum + (i.dailyPrice || 0) * 10,
        0
      );

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
    ? `${BACKEND_URL}${profile.profilePicture.startsWith("/") ? "" : "/"}${
        profile.profilePicture
      }`
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f11] flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-amber-600/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-gray-100 pb-16 font-sans">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 pt-10">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-10 border-b border-gray-800/60 pb-6">
          <Link
            to="/lender/dashboard"
            className="flex items-center gap-2.5 text-gray-400 hover:text-amber-400 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900/80 hover:bg-gray-800 border border-gray-700/80 rounded-lg text-amber-300 hover:text-amber-200 transition-all shadow-sm"
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </button>
          )}
        </div>

        {/* Main Profile Card */}
        <div className="bg-gradient-to-b from-[#111113] to-[#0d0d0f] rounded-2xl border border-gray-800/60 shadow-2xl overflow-hidden">
          {/* Cover + Avatar Section */}
          <div className="relative h-56 md:h-64 bg-gradient-to-br from-gray-900 via-amber-950/30 to-gray-950">
            <div className="absolute -bottom-20 left-6 md:left-12 flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="h-40 w-40 rounded-full overflow-hidden border-4 border-amber-900/70 shadow-2xl bg-gray-950">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={`${profile?.firstName} ${profile?.lastName}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-amber-900/40 to-gray-900 text-amber-300 text-6xl font-serif font-bold">
                      {profile?.firstName?.[0]?.toUpperCase()}
                      {profile?.lastName?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Badges */}
              <div className="pb-4">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-100 tracking-tight">
                  {profile?.firstName} {profile?.lastName}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mt-3">
                  {profile?.isVerified && (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-950/60 border border-amber-900/50 rounded-full text-amber-300 text-sm">
                      <ShieldCheck className="h-4 w-4" />
                      Verified Lender
                    </div>
                  )}

                  <div className="flex items-center gap-2 px-4 py-1.5 bg-gray-950/80 border border-gray-800 rounded-full">
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-amber-200">
                      {lenderStats.averageRating.toFixed(1)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      ({lenderStats.totalReviews})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="pt-28 md:pt-32 px-6 md:px-12 pb-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-14">
              {[
                {
                  icon: Package,
                  label: "Total Items",
                  value: lenderStats.totalItems,
                  color: "amber",
                },
                {
                  icon: Home,
                  label: "Active",
                  value: lenderStats.activeListings,
                  color: "emerald",
                },
                {
                  icon: DollarSign,
                  label: "Est. Monthly",
                  value: `$${lenderStats.estimatedRevenue.toFixed(0)}`,
                  color: "amber",
                },
                {
                  icon: Star,
                  label: "Reviews",
                  value: lenderStats.totalReviews,
                  color: "amber",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-gray-950/60 border border-gray-800/70 rounded-xl p-6 text-center hover:border-amber-900/50 transition-all duration-300"
                >
                  <stat.icon
                    className={`h-9 w-9 mx-auto mb-3 text-${stat.color}-500/90`}
                  />
                  <p className="text-3xl font-bold text-gray-100">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400 mt-1.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Edit Form / View Mode */}
            {isEditing ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-7 max-w-3xl mx-auto bg-gray-950/40 border border-gray-800/60 rounded-xl p-8"
              >
                <h2 className="text-2xl font-serif font-bold text-amber-100 mb-6">
                  Edit Profile
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/40 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-medium">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/40 outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-medium">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/40 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2 font-medium">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-600 focus:ring-1 focus:ring-amber-600/40 outline-none resize-none"
                    placeholder="Introduce yourself to potential renters..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-7 py-3 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-800 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-8 py-3 bg-amber-700 hover:bg-amber-600 text-white rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                <div>
                  <h3 className="text-xl font-serif font-bold text-amber-100 mb-5 flex items-center gap-3">
                    <User className="h-5 w-5 text-amber-500/80" />
                    About Me
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {profile?.bio ||
                      "No personal description added yet. Adding a few lines helps build trust with renters."}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-bold text-amber-100 mb-5 flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-amber-500/80" />
                    Contact Information
                  </h3>
                  <div className="space-y-4 text-gray-300">
                    <p className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      {profile?.email}
                    </p>
                    <p className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      {profile?.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Account Info Row */}
                <div className="md:col-span-2 pt-8 mt-4 border-t border-gray-800/60">
                  <h3 className="text-xl font-serif font-bold text-amber-100 mb-6">
                    Account Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <div>
                      <p className="text-sm text-gray-500">Member Since</p>
                      <p className="mt-1.5 font-medium text-gray-200">
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
                      <p className="text-sm text-gray-500">Status</p>
                      <p className="mt-1.5 font-medium flex items-center gap-2 text-emerald-400">
                        <ShieldCheck className="h-4 w-4" />
                        Active & Verified
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="mt-1.5 font-medium capitalize text-amber-300">
                        {profile?.role}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
