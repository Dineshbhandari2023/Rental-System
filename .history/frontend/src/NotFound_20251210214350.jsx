import React from "react";
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

function PageNotFound() {
  return (
    <div>
      <h2 className="text-3xl font-bold font-sans">404 Page Not Found 😥</h2>
      <button onClick={() => navigate("/login")}></button>
    </div>
  );
}

export default PageNotFound;
