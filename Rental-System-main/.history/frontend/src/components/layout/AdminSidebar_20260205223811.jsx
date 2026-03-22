// src/components/layout/AdminSidebar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  ExclamationTriangleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

const items = [
  { name: "Dashboard", to: "/admin/dashboard", icon: HomeIcon },
  { name: "Users", to: "/admin/users", icon: UserGroupIcon },
  { name: "Verifications", to: "/admin/verifications", icon: ShieldCheckIcon },
  { name: "Transactions", to: "/admin/transactions", icon: CreditCardIcon },
  { name: "Disputes", to: "/admin/disputes", icon: ExclamationTriangleIcon },
  { name: "Content", to: "/admin/content", icon: DocumentCheckIcon },
];

const AdminSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-64 fixed left-0 top-0 h-full bg-gradient-to-b from-gray-950 to-gray-900 border-r border-amber-900/30 shadow-2xl shadow-black/40 flex flex-col z-30">
      {/* Header / Branding */}
      <div className="p-6 border-b border-amber-900/30">
        <h2 className="text-2xl font-serif font-bold bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 bg-clip-text text-transparent">
          Admin Vault
        </h2>
        <p className="text-sm text-amber-400/70 mt-1 font-light tracking-wide">
          System Control
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.to;
          return (
            <Link
              key={item.name}
              to={item.to}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-amber-900/30 text-amber-100 border border-amber-700/50 shadow-sm"
                    : "text-amber-300/90 hover:bg-amber-950/30 hover:text-amber-100 border border-transparent"
                }
              `}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-amber-900/30 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-all font-medium"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <span>Logout</span>
        </button>

        <div className="mt-6 text-xs text-amber-600/60 text-center font-light">
          Version 1.0.0 • {new Date().getFullYear()}
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
