import React, { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
  const [data, setData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("/api/auth/resetpassword", data);

      setMessage("Password updated successfully!");
    } catch (err) {
      setMessage(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>

        {message && <p className="text-green-700">{message}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 mt-4"
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />

          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border p-3 mt-4"
            onChange={(e) => setData({ ...data, otp: e.target.value })}
          />

          <input
            type="password"
            placeholder="New Password"
            className="w-full border p-3 mt-4"
            onChange={(e) => setData({ ...data, newPassword: e.target.value })}
          />

          <button className="w-full bg-green-600 text-white py-3 mt-4">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
