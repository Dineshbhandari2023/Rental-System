import React, { useState } from "react";
import authService from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import Message from "../common/Message";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      setLoading(true);
      const response = await authService.forgotPassword(email);
      setMessage("OTP sent to your email!");
      setLoading(false);

      // Redirect to reset password page with email pre-filled
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="max-w-md w-full bg-amber-50 border-4 border-amber-800 p-8 shadow-xl">
        <h2 className="text-3xl font-serif font-bold text-amber-950 mb-6">
          Forgot Password
        </h2>

        {message && <Message type="success" message={message} />}
        {error && <Message type="error" message={error} />}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-serif text-amber-900 mb-2">
              Enter your email
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 border-2 bg-amber-50 border-amber-800"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-800 text-white py-3 font-serif font-semibold border-4 border-amber-950 hover:bg-amber-900"
          >
            {loading ? "Sending OTP..." : "Send OTP"}
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

export default ForgotPassword;
