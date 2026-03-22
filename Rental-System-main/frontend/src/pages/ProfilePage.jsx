import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import Message from "../components/common/Message";
import api from "../services/api";
import {
  UserCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
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
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // Fetch Profile Using Axios API Instance
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile"); // ⬅ axios auto injects token
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
            country: data.address?.country || "USA",
          },
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage({ type: "error", text: "Failed to load profile" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Form Input
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Submit Profile Update Using Axios API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await api.put("/users/profile", formData);
      if (res.data.success) {
        setUser(res.data.user);
        setIsEditing(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({
          type: "error",
          text: res.data.error || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Error updating profile" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          zipCode: user.address?.zipCode || "",
          country: user.address?.country || "USA",
        },
      });
    }
  };

  // Show loading spinner
  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-stone-100 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-800 border-t-transparent"></div>
            <p className="mt-4 text-xl font-serif text-amber-900">
              Loading profile...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-stone-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-amber-950">
              My Profile
            </h1>
            <p className="mt-2 text-lg font-serif text-amber-800">
              Manage your account information
            </p>
          </div>

          {/* Messages */}
          {message && (
            <div className="mb-6">
              <Message
                type={message.type}
                message={message.text}
                onClose={() => setMessage(null)}
              />
            </div>
          )}

          {/* Profile Body */}
          <div className="bg-amber-50 border-4 border-amber-800 shadow-2xl">
            <div className="bg-amber-100 border-b-4 border-amber-800 p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden bg-amber-800 border-4 border-amber-950 shadow-lg">
                    {user?.profilePicture ? (
                      <img
                        src={
                          BACKEND_URL
                            ? `${BACKEND_URL.replace(/\/$/, "")}${
                                user.profilePicture
                              }`
                            : user.profilePicture
                        }
                        alt={`${user.firstName}'s profile`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error(
                            "Failed to load image from:",
                            e.currentTarget.src
                          );
                          e.currentTarget.src =
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <UserCircleIcon className="w-24 h-24 text-amber-50" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-3xl font-serif font-bold text-amber-950">
                      {user?.firstName} {user?.lastName}
                    </h2>
                    <p className="mt-2 text-base font-serif text-amber-800">
                      {user?.role === "both"
                        ? "Borrower & Lender"
                        : user?.role === "lender"
                        ? "Lender"
                        : "Borrower"}
                    </p>
                    {user?.isVerified && (
                      <span className="inline-block mt-2 bg-green-800 text-green-50 px-3 py-1 text-sm font-serif font-semibold border-2 border-green-900">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center bg-amber-800 text-amber-50 font-serif font-bold px-6 py-3 border-4 border-amber-950 hover:bg-amber-900 transition-colors"
                  >
                    <PencilIcon className="h-5 w-5 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            {/* Profile content + edit forms */}
            <div className="p-8">
              {isEditing ? (
                /* EDIT MODE */
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                      Personal Information
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-amber-800 font-serif bg-amber-50 focus:outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-amber-800 font-serif bg-amber-50 focus:outline-none"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                      Contact Information
                    </h3>

                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={user?.email}
                          disabled
                          className="w-full px-4 py-3 border-2 border-amber-800 bg-amber-200 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-amber-800 bg-amber-50"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                      Address
                    </h3>

                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                          Street
                        </label>
                        <input
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-amber-800 bg-amber-50"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-amber-800 bg-amber-50"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-amber-800 bg-amber-50"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="address.zipCode"
                            value={formData.address.zipCode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-amber-800 bg-amber-50"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            name="address.country"
                            value={formData.address.country}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-amber-800 bg-amber-50"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t-2 border-amber-800">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="bg-amber-100 text-amber-900 px-6 py-3 border-2 border-amber-800 font-serif"
                    >
                      <XMarkIcon className="h-5 w-5 inline-block mr-2" />
                      Cancel
                    </button>

                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-amber-800 text-amber-50 px-6 py-3 border-4 border-amber-950 font-serif hover:bg-amber-900 disabled:opacity-50"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              ) : (
                /* VIEW MODE */
                <>
                  {/* VIEW MODE */}
                  <div className="space-y-8">
                    {/* General Information */}
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                        Account Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div>
                          <p className="text-sm font-serif font-semibold text-amber-800">
                            First Name
                          </p>
                          <p className="text-lg font-serif text-amber-950">
                            {user?.firstName}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-serif font-semibold text-amber-800">
                            Last Name
                          </p>
                          <p className="text-lg font-serif text-amber-950">
                            {user?.lastName}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-serif font-semibold text-amber-800">
                            Email
                          </p>
                          <p className="text-lg font-serif text-amber-950">
                            {user?.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-serif font-semibold text-amber-800">
                            Phone
                          </p>
                          <p className="text-lg font-serif text-amber-950">
                            {user?.phone || "Not provided"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-serif font-semibold text-amber-800">
                            Role
                          </p>
                          <p className="text-lg font-serif text-amber-950 capitalize">
                            {user?.role}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-serif font-semibold text-amber-800">
                            Verification Status
                          </p>
                          <p className="text-lg font-serif text-amber-950">
                            {user?.isVerified ? "✔ Verified" : "Not Verified"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-serif font-semibold text-amber-800">
                            Account Status
                          </p>
                          <p className="text-lg font-serif text-amber-950">
                            {user?.isActive ? "Active" : "Inactive"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm font-serif font-semibold text-amber-800">
                            Member Since
                          </p>
                          <p className="text-lg font-serif text-amber-950">
                            {new Date(user?.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Address Information */}
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                        Address Details
                      </h3>

                      <div className="space-y-2 mt-4">
                        <p className="text-lg font-serif text-amber-950">
                          {user?.address?.street || "No street provided"}
                        </p>
                        <p className="text-lg font-serif text-amber-950">
                          {user?.address?.city && user?.address?.state
                            ? `${user.address.city}, ${user.address.state}`
                            : "City / State not provided"}
                        </p>
                        <p className="text-lg font-serif text-amber-950">
                          {user?.address?.zipCode || "Zip code not provided"}
                        </p>
                        <p className="text-lg font-serif text-amber-950">
                          {user?.address?.country || "Country not provided"}
                        </p>
                      </div>
                    </div>

                    {/* Ratings */}
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                        User Ratings
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                        <div className="bg-amber-100 border-2 border-amber-800 p-4 text-center">
                          <p className="text-3xl font-serif font-bold text-amber-950">
                            {user?.rating
                              ? user.rating.toFixed(1)
                              : "No rating"}
                          </p>
                          <p className="text-sm font-serif text-amber-800 mt-1">
                            Rating
                          </p>
                        </div>

                        <div className="bg-amber-100 border-2 border-amber-800 p-4 text-center">
                          <p className="text-3xl font-serif font-bold text-amber-950">
                            {user?.totalRatings || 0}
                          </p>
                          <p className="text-sm font-serif text-amber-800 mt-1">
                            Total Reviews
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Admin Info */}
                    {user?.adminInfo && (
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                          Admin Information
                        </h3>

                        <div className="space-y-4 mt-4">
                          <div>
                            <p className="text-sm font-serif text-amber-800">
                              Permissions
                            </p>
                            <p className="text-lg font-serif text-amber-950">
                              {user.adminInfo.permissions?.join(", ") || "None"}
                            </p>
                          </div>

                          <div>
                            <p className="text-sm font-serif text-amber-800">
                              Last Login
                            </p>
                            <p className="text-lg font-serif text-amber-950">
                              {user.adminInfo.lastLogin
                                ? new Date(
                                    user.adminInfo.lastLogin
                                  ).toLocaleString()
                                : "No record"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
