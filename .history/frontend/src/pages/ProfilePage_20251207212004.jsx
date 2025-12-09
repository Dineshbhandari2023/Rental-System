import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import Message from "../common/Message";
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

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setFormData({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          phone: data.user.phone || "",
          address: {
            street: data.user.address?.street || "",
            city: data.user.address?.city || "",
            state: data.user.address?.state || "",
            zipCode: data.user.address?.zipCode || "",
            country: data.user.address?.country || "USA",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setIsEditing(false);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to update profile",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "Failed to update profile" });
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

          {message && (
            <div className="mb-6">
              <Message
                type={message.type}
                message={message.text}
                onClose={() => setMessage(null)}
              />
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-amber-50 border-4 border-amber-800 shadow-2xl">
            {/* Profile Header */}
            <div className="bg-amber-100 border-b-4 border-amber-800 p-8">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-amber-800 border-4 border-amber-950 flex items-center justify-center">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserCircleIcon className="w-16 h-16 text-amber-50" />
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

            {/* Profile Content */}
            <div className="p-8">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
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
                          className="w-full px-4 py-3 border-2 border-amber-800 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950"
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
                          className="w-full px-4 py-3 border-2 border-amber-800 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                      Contact Information
                    </h3>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user?.email}
                          disabled
                          className="w-full px-4 py-3 border-2 border-amber-800 font-serif bg-amber-200 text-amber-800 cursor-not-allowed"
                        />
                        <p className="mt-1 text-sm font-serif italic text-amber-800">
                          Email cannot be changed
                        </p>
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
                          className="w-full px-4 py-3 border-2 border-amber-800 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                      Address
                    </h3>
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          name="address.street"
                          value={formData.address.street}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border-2 border-amber-800 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-amber-800 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950"
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
                            className="w-full px-4 py-3 border-2 border-amber-800 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-base font-serif font-semibold text-amber-950 mb-2">
                            ZIP Code
                          </label>
                          <input
                            type="text"
                            name="address.zipCode"
                            value={formData.address.zipCode}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border-2 border-amber-800 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950"
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
                            className="w-full px-4 py-3 border-2 border-amber-800 font-serif bg-amber-50 text-amber-950 focus:outline-none focus:border-amber-950"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-6 border-t-2 border-amber-800">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="inline-flex items-center bg-amber-100 text-amber-900 font-serif font-bold px-6 py-3 border-2 border-amber-800 hover:bg-amber-200 transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5 mr-2" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center bg-amber-800 text-amber-50 font-serif font-bold px-6 py-3 border-4 border-amber-950 hover:bg-amber-900 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-50"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckIcon className="h-5 w-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-8">
                  {/* Personal Information Display */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div>
                        <p className="text-sm font-serif font-semibold text-amber-800">
                          First Name
                        </p>
                        <p className="text-lg font-serif text-amber-950 mt-1">
                          {user?.firstName}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-serif font-semibold text-amber-800">
                          Last Name
                        </p>
                        <p className="text-lg font-serif text-amber-950 mt-1">
                          {user?.lastName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information Display */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                      Contact Information
                    </h3>
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center space-x-3">
                        <EnvelopeIcon className="h-6 w-6 text-amber-800" />
                        <div>
                          <p className="text-sm font-serif font-semibold text-amber-800">
                            Email
                          </p>
                          <p className="text-lg font-serif text-amber-950">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <PhoneIcon className="h-6 w-6 text-amber-800" />
                        <div>
                          <p className="text-sm font-serif font-semibold text-amber-800">
                            Phone
                          </p>
                          <p className="text-lg font-serif text-amber-950">
                            {user?.phone || "Not provided"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Display */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                      Address
                    </h3>
                    <div className="flex items-start space-x-3 mt-4">
                      <MapPinIcon className="h-6 w-6 text-amber-800 mt-1" />
                      <div>
                        <p className="text-lg font-serif text-amber-950">
                          {user?.address?.street || "No street address"}
                        </p>
                        <p className="text-lg font-serif text-amber-950">
                          {user?.address?.city && user?.address?.state
                            ? `${user.address.city}, ${user.address.state} ${user.address.zipCode}`
                            : "No city/state information"}
                        </p>
                        <p className="text-lg font-serif text-amber-950">
                          {user?.address?.country || "USA"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Account Stats */}
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-amber-950 mb-4 pb-2 border-b-2 border-amber-800">
                      Account Statistics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="bg-amber-100 border-2 border-amber-800 p-4 text-center">
                        <p className="text-3xl font-serif font-bold text-amber-950">
                          {user?.rating ? user.rating.toFixed(1) : "N/A"}
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
                      <div className="bg-amber-100 border-2 border-amber-800 p-4 text-center">
                        <p className="text-3xl font-serif font-bold text-amber-950">
                          {new Date(user?.createdAt).getFullYear()}
                        </p>
                        <p className="text-sm font-serif text-amber-800 mt-1">
                          Member Since
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
    </Layout>
  );
};

export default Profile;
