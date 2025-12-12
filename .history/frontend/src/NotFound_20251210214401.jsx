import React from "react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const navigate = useNavigate();
  return (
    <div>
      <h2 className="text-3xl font-bold font-sans">404 Page Not Found 😥</h2>
      <button onClick={() => navigate("/login")}></button>
    </div>
  );
}

export default PageNotFound;
