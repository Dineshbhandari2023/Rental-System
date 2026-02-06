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

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL?.replace("/api", "");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

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
          className: "text-red-800 hover:text-red-950",
        },
      ]
    : [
        { name: "Login", path: "/login", icon: ArrowRightOnRectangleIcon },
        { name: "Register", path: "/register", icon: UserCircleIcon },
      ];
  const profileImageUrl = user?.profilePicture?.startsWith("http")
    ? user.profilePicture
    : `${API_BASE_URL}${user?.profilePicture}`;

  return (
    <header className="bg-amber-50 shadow-md border-b-4 border-amber-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-800 rounded-sm flex items-center justify-center border-2 border-amber-900">
                <ShoppingBagIcon className="h-6 w-6 text-amber-50" />
              </div>
              <span className="text-2xl font-serif font-bold text-amber-900">
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
                className="text-amber-900 hover:text-amber-950 font-serif font-semibold text-lg underline decoration-dotted hover:decoration-solid transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}

            {/* User menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2 text-amber-900 hover:text-amber-950 border-2 border-amber-800 px-4 py-2 bg-amber-100 hover:bg-amber-200 transition-colors">
                {user ? (
                  <>
                    {user.profilePicture ? (
                      <img
                        src={
                          BACKEND_URL
                            ? `${BACKEND_URL.replace(/\/$/, "")}${
                                user.profilePicture
                              }`
                            : user.profilePicture
                        }
                        alt="Profile"
                        className="h-8 w-8 rounded-full object-cover border-2 border-amber-800"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
                        }}
                      />
                    ) : (
                      <UserCircleIcon className="h-6 w-6" />
                    )}

                    <span className="font-serif font-semibold">
                      {user.firstName}
                    </span>
                  </>
                ) : (
                  <>
                    <UserCircleIcon className="h-6 w-6" />
                    <span className="font-serif font-semibold">Account</span>
                  </>
                )}
              </button>

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-56 bg-amber-50 border-4 border-amber-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {userMenuItems.map((item) =>
                  item.onClick ? (
                    <button
                      key={item.name}
                      onClick={item.onClick}
                      className={`w-full text-left px-4 py-3 text-base font-serif hover:bg-amber-100 flex items-center space-x-2 border-b border-amber-300 ${
                        item.className || "text-amber-900"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block px-4 py-3 text-base font-serif text-amber-900 hover:bg-amber-100 flex items-center space-x-2 border-b border-amber-300"
                    >
                      <item.icon className="h-5 w-5" />
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
              className="p-2 text-amber-900 hover:text-amber-950 border-2 border-amber-800 bg-amber-100"
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
          <div className="md:hidden py-4 border-t-2 border-amber-800">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 text-amber-900 hover:text-amber-950 font-serif font-semibold hover:bg-amber-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t-2 border-amber-800 pt-2 mt-2">
                {userMenuItems.map((item) =>
                  item.onClick ? (
                    <button
                      key={item.name}
                      onClick={() => {
                        item.onClick();
                        setIsMenuOpen(false);
                      }}
                      className={`block w-full text-left px-3 py-2 text-base font-serif hover:bg-amber-100 ${
                        item.className || "text-amber-900"
                      }`}
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="block px-3 py-2 text-base font-serif text-amber-900 hover:bg-amber-100"
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
