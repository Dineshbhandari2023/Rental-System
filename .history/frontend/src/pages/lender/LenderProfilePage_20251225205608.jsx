import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, DollarSign, Star, Home } from "lucide-react";
import { toast } from "sonner";
import authService from "../../services/authService";
import itemService from "../../services/itemService";

export default function LenderProfilePage() {
  const [profile, setProfile] = useState(null);
  const [lenderStats, setLenderStats] = useState({
    totalItems: 0,
    activeListings: 0,
    totalRevenue: 0,
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

      // Load user profile
      const profileRes = await authService.getProfile();
      const userData = profileRes.user || profileRes;
      setProfile(userData);

      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        bio: userData.bio || "",
      });

      // Load lender stats from items
      const itemsRes = await itemService.getMyItems();
      const items = itemsRes.items || itemsRes || [];

      const active = items.filter((i) => i.isAvailable).length;
      const revenue = items.reduce(
        (sum, i) => sum + (i.dailyPrice || 0) * 30,
        0
      );

      setLenderStats({
        totalItems: items.length,
        activeListings: active,
        totalRevenue: revenue,
        averageRating: userData.lenderRating || 0,
        totalReviews: userData.lenderReviews || 0,
      });
    } catch (error) {
      toast.error(error.message || "Failed to load profile");
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
      loadProfileAndStats(); // Refresh
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            Loading your lender profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Lender Profile</h1>
            <p className="text-lg text-gray-600 mt-2">
              Manage your account and view your lending performance
            </p>
          </div>
          <Link to="/lender/dashboard">
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium">
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </button>
          </Link>
        </div>

        {/* Main Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white">
                  <span className="text-5xl font-bold">
                    {profile?.firstName?.[0]?.toUpperCase()}
                    {profile?.lastName?.[0]?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold">
                  {profile?.firstName} {profile?.lastName}
                </h2>
                <p className="text-blue-100 mt-1 text-lg">Verified Lender</p>
                <div className="flex items-center gap-2 mt-3 justify-center md:justify-start">
                  <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                  <span className="text-2xl font-bold">
                    {lenderStats.averageRating.toFixed(1) || "N/A"}
                  </span>
                  <span className="text-blue-200">
                    ({lenderStats.totalReviews} reviews)
                  </span>
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="md:ml-auto bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="p-8 bg-gray-50 border-b">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Lending Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Package className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">
                  {lenderStats.totalItems}
                </p>
                <p className="text-gray-600">Total Listings</p>
              </div>
              <div className="text-center">
                <Home className="h-10 w-10 text-green-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">
                  {lenderStats.activeListings}
                </p>
                <p className="text-gray-600">Active Now</p>
              </div>
              <div className="text-center">
                <DollarSign className="h-10 w-10 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">
                  ${lenderStats.totalRevenue.toFixed(0)}
                </p>
                <p className="text-gray-600">Est. Monthly Income</p>
              </div>
              <div className="text-center">
                <Star className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                <p className="text-3xl font-bold text-gray-900">
                  {lenderStats.totalReviews}
                </p>
                <p className="text-gray-600">Total Reviews</p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Edit Profile
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio (Optional)
                  </label>
                  <textarea
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell renters a bit about yourself..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-8 max-w-3xl">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    About Me
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {profile?.bio ||
                      "No bio added yet. Add one to help borrowers know you better!"}
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Contact Info
                  </h3>
                  <div className="space-y-3">
                    <p className="text-gray-700">
                      <strong>Email:</strong> {profile?.email}
                    </p>
                    <p className="text-gray-700">
                      <strong>Phone:</strong> {profile?.phone || "Not provided"}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Account Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <p className="font-medium text-green-600">
                        Active & Verified
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/lender/items"
            className="bg-white p-6 rounded-xl border hover:shadow-md transition text-center"
          >
            <Package className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h4 className="font-semibold text-lg">My Listings</h4>
            <p className="text-gray-600 mt-2">View and manage your items</p>
          </Link>

          <Link
            to="/lender/bookings/requests"
            className="bg-white p-6 rounded-xl border hover:shadow-md transition text-center"
          >
            <Calendar className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h4 className="font-semibold text-lg">Booking Requests</h4>
            <p className="text-gray-600 mt-2">Approve or reject rentals</p>
          </Link>

          <Link
            to="/lender/bookings"
            className="bg-white p-6 rounded-xl border hover:shadow-md transition text-center"
          >
            <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h4 className="font-semibold text-lg">My Rentals</h4>
            <p className="text-gray-600 mt-2">Track active and past rentals</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
