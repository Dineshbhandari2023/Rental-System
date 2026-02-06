// src/components/layout/AdminLayout.jsx
import React from "react";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-6 lg:p-8 xl:p-10 overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
