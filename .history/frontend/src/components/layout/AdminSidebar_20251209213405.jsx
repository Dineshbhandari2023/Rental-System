import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  HomeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  DocumentCheckIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const items = [
  { name: "Dashboard", to: "/admin", icon: HomeIcon },
  { name: "Users", to: "/admin/users", icon: UserGroupIcon },
  { name: "Verifications", to: "/admin/verifications", icon: ShieldCheckIcon },
  { name: "Transactions", to: "/admin/transactions", icon: CreditCardIcon },
  { name: "Disputes", to: "/admin/disputes", icon: ExclamationTriangleIcon },
  { name: "Content", to: "/admin/content", icon: DocumentCheckIcon },
  { name: "Analytics", to: "/admin/analytics", icon: ChartBarIcon },
  { name: "Settings", to: "/admin/settings", icon: ChartBarIcon },
];

const AdminSidebar = () => {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 fixed left-0 top-0 h-full bg-white border-r border-gray-200 p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Admin Panel</h2>
        <p className="text-sm text-gray-500 mt-1">Control center</p>
      </div>

      <nav className="space-y-1">
        {items.map((it) => {
          const active = pathname === it.to;
          return (
            <Link
              key={it.name}
              to={it.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <it.icon className="h-5 w-5" />
              <span>{it.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 text-xs text-gray-400">v1.0.0</div>
    </aside>
  );
};

export default AdminSidebar;
