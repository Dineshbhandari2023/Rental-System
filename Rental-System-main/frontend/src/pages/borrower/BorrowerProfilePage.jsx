// src/pages/borrower/BorrowerProfilePage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import Message from "../../components/common/Message";
import api from "../../services/api";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Pencil,
  Check,
  X,
  Camera,
  CalendarDays,
  Star,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function BorrowerProfilePage() {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
  });

  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/users/profile");
      if (res.data.success) {
        const data = res.data.user;
        setUser(data);
        setFormData({
          firstName: data.firstName || "",
          lastName: data.lastName || "",
          phone: data.phone || "",
          address: {
            street: data.address?.street || "",
            city: data.address?.city || "",
            state: data.address?.state || "",
            zipCode: data.address?.zipCode || "",
            country: data.address?.country || "NPL",
          },
        });
        setPreviewImage(
          data.profilePicture
            ? `${BACKEND_URL}${data.profilePicture.startsWith("/") ? "" : "/"}${data.profilePicture}`
            : null,
        );
      }
    } catch (err) {
      console.error("Profile fetch failed:", err);
      setMessage({ type: "error", text: "Could not load your profile" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: "error", text: "Image must be under 2MB" });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const payload = new FormData();
      payload.append("firstName", formData.firstName.trim());
      payload.append("lastName", formData.lastName.trim());
      payload.append("phone", formData.phone.trim());
      payload.append("address", JSON.stringify(formData.address));

      if (fileInputRef.current?.files?.[0]) {
        payload.append("profilePicture", fileInputRef.current.files[0]);
      }

      const res = await api.put("/users/profile", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setUser(res.data.user);
        setIsEditing(false);
        setMessage({ type: "success", text: "Profile updated successfully" });
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to update profile",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(
      user?.profilePicture
        ? `${BACKEND_URL}${user.profilePicture.startsWith("/") ? "" : "/"}${user.profilePicture}`
        : null,
    );
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: { ...user.address },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="h-14 w-14 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-6 text-xl text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-950 to-gray-900 text-gray-100 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            My Profile
          </h1>
          <p className="text-gray-400 mt-1">Manage your personal information</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {message && (
          <div className="mb-8">
            <Message
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          </div>
        )}

        <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Profile Header / Avatar */}
          <div className="bg-gradient-to-r from-amber-950 to-gray-950 px-6 sm:px-10 py-12 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
              <div className="relative group">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-amber-700/40 shadow-2xl bg-gray-950">
                  {previewImage || user?.profilePicture ? (
                    <img
                      src={
                        previewImage || `${BACKEND_URL}${user.profilePicture}`
                      }
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-950">
                      <UserCircle className="w-20 h-20 text-amber-600/70" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-3 right-3 bg-amber-700 hover:bg-amber-600 text-white p-3 rounded-full shadow-lg transition-all transform hover:scale-110 ring-2 ring-amber-500/40"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="mt-2 text-xl text-amber-300/90 capitalize">
                  {user?.role || "Borrower"}
                </p>

                <div className="mt-5 flex flex-wrap gap-4 justify-center sm:justify-start">
                  {user?.isVerified ? (
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-900/70 text-emerald-300 rounded-full text-sm font-medium border border-emerald-800/50 backdrop-blur-sm">
                      <ShieldCheck className="w-5 h-5" />
                      Verified Borrower
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-amber-900/70 text-amber-300 rounded-full text-sm font-medium border border-amber-800/50 backdrop-blur-sm">
                      <AlertCircle className="w-5 h-5" />
                      Verification Pending
                    </div>
                  )}

                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-gray-800/70 text-gray-300 rounded-full text-sm font-medium border border-gray-700 backdrop-blur-sm">
                    <CalendarDays className="w-5 h-5" />
                    Member since {new Date(user?.createdAt).getFullYear()}
                  </div>
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 sm:mt-0 px-7 py-3 bg-amber-800/80 hover:bg-amber-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg shadow-amber-900/30 border border-amber-700/50"
                >
                  <Pencil className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 sm:p-10">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-12">
                {/* Personal Details */}
                <section>
                  <h3 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-800">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* Contact */}
                <section>
                  <h3 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-800">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-5 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-5 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                      />
                    </div>
                  </div>
                </section>

                {/* Address */}
                <section>
                  <h3 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-800">
                    Address
                  </h3>
                  <div className="space-y-6">
                    <input
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="Street address"
                      className="w-full px-5 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full px-5 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                      />
                      <input
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder="State / Province"
                        className="w-full px-5 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        placeholder="ZIP / Postal Code"
                        className="w-full px-5 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                      />
                      <input
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        placeholder="Country"
                        className="w-full px-5 py-3.5 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition"
                      />
                    </div>
                  </div>
                </section>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-800">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-3.5 border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-10 py-3.5 bg-amber-700 hover:bg-amber-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-amber-900/30 min-w-[180px]"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* ────────────────────────────────────────────── VIEW MODE ───── */
              <div className="space-y-12 p-6 sm:p-10">
                {/* Contact & Account Info */}
                <section>
                  <h3 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-800">
                    Account Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoCard
                      icon={<Mail className="w-6 h-6 text-amber-500" />}
                      label="Email"
                      value={user?.email || "—"}
                    />
                    <InfoCard
                      icon={<Phone className="w-6 h-6 text-amber-500" />}
                      label="Phone"
                      value={user?.phone || "Not provided"}
                    />

                    <InfoCard
                      icon={<UserCircle className="w-6 h-6 text-amber-500" />}
                      label="Role"
                      value={user?.role?.toUpperCase() || "BORROWER"}
                    />
                    <InfoCard
                      icon={
                        user?.isVerified ? (
                          <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <AlertCircle className="w-6 h-6 text-amber-500" />
                        )
                      }
                      label="Verification Status"
                      value={
                        user?.isVerified ? "Verified" : "Pending / Not Verified"
                      }
                      highlight={
                        user?.isVerified ? "text-emerald-400" : "text-amber-400"
                      }
                    />
                  </div>
                </section>

                {/* Address */}
                <section>
                  <h3 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-800">
                    Address
                  </h3>
                  <div className="bg-gray-950/50 p-7 rounded-xl border border-gray-800">
                    <div className="flex items-start gap-4 text-lg">
                      <MapPin className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                      <div className="space-y-1 text-gray-300">
                        <p>{user?.address?.street || "—"}</p>
                        <p>
                          {user?.address?.city && user?.address?.state
                            ? `${user.address.city}, ${user.address.state}`
                            : "—"}
                        </p>
                        <p>{user?.address?.zipCode || "—"}</p>
                        <p className="font-medium text-amber-300">
                          {user?.address?.country || "Nepal"}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Reputation */}
                <section>
                  <h3 className="text-2xl font-bold text-white mb-6 pb-3 border-b border-gray-800">
                    Reputation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gray-950/50 p-8 rounded-xl border border-gray-800 text-center">
                      <div className="text-6xl font-bold text-amber-400">
                        {user?.rating ? user.rating.toFixed(1) : "—"}
                      </div>
                      <p className="text-lg text-gray-400 mt-3">
                        Average Rating
                      </p>
                    </div>
                    <div className="bg-gray-950/50 p-8 rounded-xl border border-gray-800 text-center">
                      <div className="text-6xl font-bold text-amber-400">
                        {user?.totalRatings || 0}
                      </div>
                      <p className="text-lg text-gray-400 mt-3">
                        Total Reviews
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable Info Card
function InfoCard({ icon, label, value, highlight = "" }) {
  return (
    <div className="bg-gray-950/50 p-6 rounded-xl border border-gray-800 hover:border-amber-800/50 transition-all">
      <div className="flex items-center gap-4 mb-3">
        {icon}
        <span className="text-sm font-medium text-gray-400">{label}</span>
      </div>
      <p className={`text-xl font-medium ${highlight || "text-gray-200"}`}>
        {value}
      </p>
    </div>
  );
}
