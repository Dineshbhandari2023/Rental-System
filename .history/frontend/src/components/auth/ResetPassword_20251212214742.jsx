import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import Message from "../common/Message";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const prefilledEmail = location.state?.email || "";

  const [formData, setFormData] = useState({
    email: prefilledEmail,
    otp: "",
    newPassword: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      const res = await authService.resetPassword(formData);
      setMessage("Password reset successful!");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="max-w-md w-full bg-amber-50 border-4 border-amber-800 p-8 shadow-xl">
        <h2 className="text-3xl font-serif font-bold text-amber-950 mb-6">
          Reset Password
        </h2>

        {message && <Message type="success" message={message} />}
        {error && <Message type="error" message={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-serif text-amber-900 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              disabled={!!prefilledEmail}
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 bg-amber-50 border-amber-800"
              required
            />
          </div>

          <div>
            <label className="block font-serif text-amber-900 mb-2">
              OTP Code
            </label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 bg-amber-50 border-amber-800"
              placeholder="Enter 6-digit OTP"
              required
            />
          </div>

          <div>
            <label className="block font-serif text-amber-900 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 bg-amber-50 border-amber-800"
              placeholder="Enter a new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-800 text-white py-3 font-serif font-semibold border-4 border-amber-950 hover:bg-amber-900"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p className="mt-6 text-center">
          <Link to="/login" className="text-amber-800 underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
