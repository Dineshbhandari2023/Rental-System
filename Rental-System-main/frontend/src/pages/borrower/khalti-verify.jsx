import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function KhaltiVerify() {
  const navigate = useNavigate();

  useEffect(() => {
    alert("Payment successful");

    setTimeout(() => {
      navigate("/borrower/bookings");
    }, 1500);
  }, []);

  return (
    <div className="p-10 text-center text-lg font-medium">
      Payment successful! Redirecting...
    </div>
  );
}