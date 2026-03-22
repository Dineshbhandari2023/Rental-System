import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 ml-64 p-6">
        {" "}
        {/* ml-64 matches sidebar width */}
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
