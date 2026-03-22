import React from "react";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white p-5 rounded-xl shadow-sm border border-gray-200 ${className}`}
  >
    {children}
  </div>
);

export default Card;
