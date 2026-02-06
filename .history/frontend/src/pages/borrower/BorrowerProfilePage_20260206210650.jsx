import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
// import BorrowerLayout from "../borrower/BorrowerLayout";
import Message from "../../components/common/Message";
import api from "../../services/api";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  CameraIcon,
} from "@heroicons/react/24/outline";

const BorrowerProfilePage = () => {
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

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
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
            ? `${BACKEND_URL}${data.profilePicture.startsWith("/") ? "" : "/"}${
                data.profilePicture
              }`
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
    const file = e.target.files[0];
    if (!file) return;

    // Optional: add size/type validation
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
      payload.append("firstName", formData.firstName);
      payload.append("lastName", formData.lastName);
      payload.append("phone", formData.phone);

      // Flatten address or send as JSON string – depending on backend
      payload.append("address", JSON.stringify(formData.address));

      // If new image selected
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

        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Profile update failed:", err);
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
        ? `${BACKEND_URL}${user.profilePicture.startsWith("/") ? "" : "/"}${
            user.profilePicture
          }`
        : null,
    );
    if (fileInputRef.current) fileInputRef.current.value = "";
    // reset formData to original values
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: { ...user.address },
      });
    }
  };

  return (
    // <BorrowerLayout>
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-amber-50/40 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-950 mb-2">
          My Profile
        </h1>
        <p className="text-lg text-amber-800/90 mb-10">
          Manage your personal information and preferences
        </p>

        {message && (
          <div className="mb-8">
            <Message
              type={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
            />
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/60 overflow-hidden">
          {/* Header / Avatar section */}
          <div className="bg-gradient-to-r from-amber-800 to-amber-950 px-8 py-10 text-white">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-10">
              <div className="relative group">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-amber-200/40 shadow-2xl bg-amber-900">
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
                    <div className="w-full h-full flex items-center justify-center">
                      <UserCircleIcon className="w-24 h-24 text-amber-300" />
                    </div>
                  )}
                </div>

                {isEditing && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-amber-700 hover:bg-amber-600 text-white p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                  >
                    <CameraIcon className="w-5 h-5" />
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

              <div className="text-center sm:text-left">
                <h2 className="text-3xl md:text-4xl font-serif font-bold">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="mt-2 text-xl opacity-90 capitalize">
                  {user?.role || "Borrower"}
                </p>

                <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                  {!user?.isVerified && (
                    <span className="inline-flex items-center px-4 py-1.5 bg-amber-900/70 text-amber-100 text-sm font-medium rounded-full border border-amber-300/30">
                      <XMarkIcon className="w-4 h-4 mr-1.5" />
                      Not Verified
                    </span>
                  )}
                  {user?.isVerified && (
                    <span className="inline-flex items-center px-4 py-1.5 bg-green-800/80 text-green-50 text-sm font-medium rounded-full border border-green-300/30">
                      <CheckIcon className="w-4 h-4 mr-1.5" />
                      Verified Borrower
                    </span>
                  )}
                </div>
              </div>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="mt-6 sm:mt-0 sm:ml-auto bg-amber-200/20 hover:bg-amber-300/30 text-white px-6 py-3 rounded-lg border border-amber-300/40 font-medium transition-all flex items-center gap-2"
                >
                  <PencilSquareIcon className="w-5 h-5" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="p-6 md:p-10">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Personal Info */}
                <section>
                  <h3 className="text-2xl font-serif font-semibold text-amber-900 mb-5 border-b border-amber-200 pb-2">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-amber-800 mb-2">
                        First Name
                      </label>
                      <input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/60"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-800 mb-2">
                        Last Name
                      </label>
                      <input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/60"
                        required
                      />
                    </div>
                  </div>
                </section>

                {/* Contact */}
                <section>
                  <h3 className="text-2xl font-serif font-semibold text-amber-900 mb-5 border-b border-amber-200 pb-2">
                    Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-amber-800 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-amber-800 mb-2">
                        Phone Number
                      </label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/60"
                      />
                    </div>
                  </div>
                </section>

                {/* Address */}
                <section>
                  <h3 className="text-2xl font-serif font-semibold text-amber-900 mb-5 border-b border-amber-200 pb-2">
                    Address
                  </h3>
                  <div className="space-y-6">
                    <input
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      placeholder="Street address"
                      className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/60"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/60"
                      />
                      <input
                        name="address.state"
                        value={formData.address.state}
                        onChange={handleChange}
                        placeholder="State / Province"
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/60"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        name="address.zipCode"
                        value={formData.address.zipCode}
                        onChange={handleChange}
                        placeholder="ZIP / Postal Code"
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/60"
                      />
                      <input
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        placeholder="Country"
                        className="w-full px-4 py-3 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/60"
                      />
                    </div>
                  </div>
                </section>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-amber-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-8 py-3 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isSaving ? (
                      "Saving..."
                    ) : (
                      <>
                        Save Changes <CheckIcon className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* ────────────────────────────────────────────── VIEW MODE ───── */
              <div className="space-y-12">
                <section>
                  <h3 className="text-2xl font-serif font-semibold text-amber-900 mb-6 border-b border-amber-200 pb-2">
                    Account Overview
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoCard
                      label="Email"
                      value={user?.email}
                      icon={<EnvelopeIcon />}
                    />
                    <InfoCard
                      label="Phone"
                      value={user?.phone || "—"}
                      icon={<PhoneIcon />}
                    />
                    <InfoCard
                      label="Member Since"
                      value={new Date(user?.createdAt).toLocaleDateString()}
                    />
                    <InfoCard
                      label="Role"
                      value={user?.role?.toUpperCase() || "BORROWER"}
                    />
                    <InfoCard
                      label="Verification"
                      value={user?.isVerified ? "Verified ✓" : "Not verified"}
                      highlight={
                        user?.isVerified ? "text-green-700" : "text-amber-700"
                      }
                    />
                    <InfoCard
                      label="Status"
                      value={user?.isActive ? "Active" : "Inactive"}
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-serif font-semibold text-amber-900 mb-6 border-b border-amber-200 pb-2">
                    Address
                  </h3>
                  <div className="bg-amber-50/40 p-6 rounded-xl border border-amber-100">
                    <div className="flex items-start gap-3 text-lg">
                      <MapPinIcon className="w-6 h-6 text-amber-700 mt-1 flex-shrink-0" />
                      <div>
                        <p>{user?.address?.street || "—"}</p>
                        <p>
                          {user?.address?.city && user?.address?.state
                            ? `${user.address.city}, ${user.address.state}`
                            : "—"}
                        </p>
                        <p>{user?.address?.zipCode || "—"}</p>
                        <p className="font-medium">
                          {user?.address?.country || "Nepal"}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-2xl font-serif font-semibold text-amber-900 mb-6 border-b border-amber-200 pb-2">
                    Reputation
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200 text-center">
                      <div className="text-5xl font-bold text-amber-800">
                        {user?.rating ? user.rating.toFixed(1) : "—"}
                      </div>
                      <p className="text-sm text-amber-700 mt-1">
                        Average Rating
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-xl border border-amber-200 text-center">
                      <div className="text-5xl font-bold text-amber-800">
                        {user?.totalRatings || 0}
                      </div>
                      <p className="text-sm text-amber-700 mt-1">
                        Total Reviews
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    // </BorrowerLayout>
  );
};

// Reusable small card component
function InfoCard({ label, value, icon, highlight = "" }) {
  return (
    <div className="bg-white/60 p-5 rounded-xl border border-amber-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        {icon &&
          React.cloneElement(icon, { className: "w-5 h-5 text-amber-700" })}
        <span className="text-sm font-medium text-amber-700">{label}</span>
      </div>
      <p className={`text-lg font-medium ${highlight}`}>{value}</p>
    </div>
  );
}

export default BorrowerProfilePage;
