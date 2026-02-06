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
    setFormData((p) => ({ ...p, [name]: value }));
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

  // 🔑 SAME IMAGE LOGIC AS BORROWER
  const profileImage = profile?.profilePicture
    ? `${BACKEND_URL}${profile.profilePicture.startsWith("/") ? "" : "/"}${
        profile.profilePicture
      }`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back / Edit */}
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

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Cover */}
          <div className="relative h-48 bg-gradient-to-r from-blue-600 to-indigo-700">
            <div className="absolute -bottom-16 left-6 md:left-10 flex items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-indigo-600">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white text-5xl font-bold">
                      {profile?.firstName?.[0]?.toUpperCase()}
                      {profile?.lastName?.[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Name & Status */}
              <div className="pb-3">
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  {profile?.firstName} {profile?.lastName}
                </h1>

                <div className="flex items-center gap-3 mt-1">
                  {profile?.isVerified && (
                    <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-sm text-white">
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

          {/* Body */}
          <div className="pt-20 px-6 md:px-10 pb-10">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-12">
              {[
                {
                  icon: Package,
                  label: "Listings",
                  value: lenderStats.totalItems,
                },
                {
                  icon: Home,
                  label: "Active",
                  value: lenderStats.activeListings,
                },
                {
                  icon: DollarSign,
                  label: "Est. Monthly",
                  value: `$${lenderStats.estimatedRevenue.toFixed(0)}`,
                },
                {
                  icon: Star,
                  label: "Reviews",
                  value: lenderStats.totalReviews,
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center"
                >
                  <s.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-2xl font-bold">{s.value}</p>
                  <p className="text-sm text-gray-600">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Edit / View */}
            {isEditing ? (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 max-w-3xl mx-auto"
              >
                <h2 className="text-2xl font-bold">Edit Profile</h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="input"
                    required
                  />
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="input"
                    required
                  />
                </div>

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="input"
                />

                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell renters about yourself..."
                  className="input"
                />

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg"
                  >
                    {updating ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    About Me
                  </h3>
                  <p className="text-gray-700">
                    {profile?.bio || "No bio added yet."}
                  </p>
                </div>

                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Contact
                  </h3>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> {profile?.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />{" "}
                    {profile?.phone || "Not provided"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
