import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");

  const sendOTP = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/auth/forgotpassword", { email });

      setOtpSent(true);
      setMessage("OTP sent to email!");
      console.log("OTP:", res.data.otp); // Testing only
    } catch (err) {
      setMessage(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>

        {message && <p className="text-blue-600">{message}</p>}

        {!otpSent ? (
          <form onSubmit={sendOTP}>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border p-3 mt-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="w-full bg-blue-600 text-white py-3 mt-4">
              Send OTP
            </button>
          </form>
        ) : (
          <p className="text-green-700">OTP sent! Check your email.</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
