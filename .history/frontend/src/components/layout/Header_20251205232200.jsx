import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  HomeIcon,
  ShoppingBagIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Header = () => {
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/", icon: HomeIcon },
    { name: "Browse Items", path: "/items", icon: ShoppingBagIcon },
  ];

  const userMenuItems = user
    ? [
        { name: "Dashboard", path: "/dashboard", icon: UserCircleIcon },
        { name: "Profile", path: "/profile", icon: Cog6ToothIcon },
        ...(isAdmin()
          ? [{ name: "Admin", path: "/admin", icon: Cog6ToothIcon }]
          : []),
        {
          name: "Logout",
          onClick: handleLogout,
          icon: ArrowRightOnRectangleIcon,
          className: "text-red-600 hover:text-red-700",
        },
      ]
    : [
        { name: "Login", path: "/login", icon: ArrowRightOnRectangleIcon },
        { name: "Register", path: "/register", icon: UserCircleIcon },
      ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <ShoppingBagIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {import.meta.env.REACT_APP_SITE_NAME || "Community Rental"}
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}

            {/* User menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600">
                {user ? (
                  <>
                    <UserCircleIcon className="h-6 w-6" />
                    <span className="font-medium">{user.firstName}</span>
                  </>
                ) : (
                  <>
                    <UserCircleIcon className="h-6 w-6" />
                    <span className="font-medium">Account</span>
                  </>
                )}
              </button>

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {userMenuItems.map((item) =>
                  item.onClick ? (
                    <button
                      key={item.name}
                      onClick={item.onClick}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center space-x-2 ${
                        item.className || "text-gray-700"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-700 hover:text-primary-600"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 text-gray-700 hover:text-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-2 mt-2">
                {userMenuItems.map((item) =>
                  item.onClick ? (
                    <button
                      key={item.name}
                      onClick={() => {
                        item.onClick();
                        setIsMenuOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 text-sm ${
                        item.className || "text-gray-700"
                      }`}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block px-3 py-2 text-sm text-gray-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
