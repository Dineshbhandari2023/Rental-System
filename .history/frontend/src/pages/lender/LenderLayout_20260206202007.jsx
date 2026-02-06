import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Plus,
  Menu,
  X,
  LogOut,
  User,
  Calendar,
  CalendarCheck,
  MessageCircle,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import authService from "../../services/authService";
import socketService from "../../services/socketService";
import messageService from "../../services/messageService";

const navigation = [
  {
    name: "Dashboard",
    path: "/lender/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Listings",
    path: "/lender/item",
    icon: Package,
  },
  {
    name: "Add New Item",
    path: "/lender/items/new",
    icon: Plus,
  },
  {
    name: "Booking Requests",
    path: "/lender/bookings/requests",
    icon: Calendar,
  },
  {
    name: "My Bookings",
    path: "/lender/booking",
    icon: CalendarCheck,
  },
  {
    name: "Messages",
    path: "/lender/messages",
    icon: MessageCircle,
  },
];

export default function LenderLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  // Initialize socket connection and load unread count
  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      // Connect socket
      socketService.connect(token);

      // Load initial unread count
      loadUnreadCount();

      // Listen for new messages to update count
      socketService.onNewMessage(() => {
        loadUnreadCount();
      });
    }

    return () => {
      socketService.off("newMessage");
    };
  }, []);

  const loadUnreadCount = async () => {
    try {
      const response = await messageService.getUnreadCount();
      setUnreadCount(response.count || 0);
    } catch (error) {
      console.error("Failed to load unread count:", error);
    }
  };

  const handleLogout = () => {
    authService.logout();
    socketService.disconnect();
    toast.success("Logged out successfully");
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/lender/dashboard" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">RentHub</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => {
                const active = isActive(item.path);
                const isMessages = item.path === "/lender/messages";
                return (
                  <Link key={item.name} to={item.path}>
                    <button
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors relative",
                        active
                          ? "bg-blue-600 text-white shadow-sm"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="hidden xl:inline">{item.name}</span>
                      <span className="xl:hidden">
                        {item.name.split(" ")[0]}
                      </span>
                      {isMessages && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/lender/profile">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                  <User className="h-5 w-5 text-gray-700" />
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100 transition text-red-600"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="px-4 py-4 space-y-1">
              {navigation.map((item) => {
                const active = isActive(item.path);
                const isMessages = item.path === "/lender/messages";
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left transition-colors relative",
                        active
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                      {isMessages && unreadCount > 0 && (
                        <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>
                  </Link>
                );
              })}

              <div className="pt-4 border-t border-gray-200 space-y-1">
                <Link
                  to="/lender/profile"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left">
                    <User className="h-5 w-5" />
                    Profile
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 text-left text-red-600 font-medium"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Toast Notifications */}
      <Toaster position="top-right" richColors closeButton />
    </div>
  );
}

/* Utility: className merger */
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
