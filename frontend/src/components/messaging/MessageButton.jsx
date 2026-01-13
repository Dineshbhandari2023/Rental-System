import React from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import authService from "../../services/authService";

export default function MessageButton({
  userId,
  userName,
  bookingId = null,
  variant = "primary",
  size = "md",
  className = "",
}) {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleMessageClick = () => {
    // Build URL with query parameters
    const params = new URLSearchParams({
      userId,
      userName,
    });

    if (bookingId) {
      params.append("bookingId", bookingId);
    }

    // Navigate based on user role
    const basePath = currentUser.role === "lender" ? "/lender" : "/borrower";
    navigate(`${basePath}/messages?${params.toString()}`);
  };

  // Size variants
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };

  // Style variants
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  return (
    <button
      onClick={handleMessageClick}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      <MessageCircle className="h-4 w-4" />
      Message
    </button>
  );
}
