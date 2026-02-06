// BorrowerLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  BookOpen,
  Menu,
  X,
  LogOut,
  User,
  MessageCircle,
  ChevronRight,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import authService from "../../services/authService";
import socketService from "../../services/socketService";
import messageService from "../../services/messageService";

const navigation = [
  { name: "Dashboard", path: "/borrower/dashboard", icon: LayoutDashboard },
  { name: "Browse Rentals", path: "/borrower/browse", icon: Search },
  { name: "My Bookings", path: "/borrower/bookings", icon: BookOpen },
  { name: "Messages", path: "/borrower/messages", icon: MessageCircle },
];

export default function BorrowerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      socketService.connect(token);
      loadUnreadCount();

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
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 text-gray-100 flex flex-col">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-amber-900/40 bg-gradient-to-r from-gray-950 to-gray-900 shadow-lg shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link
              to="/borrower/dashboard"
              className="flex items-center gap-3 group"
            >
              <div className="h-9 w-9 md:h-10 md:w-10 rounded-lg bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center shadow-md group-hover:shadow-amber-900/50 transition-shadow">
                <Search className="h-5 w-5 md:h-6 md:w-6 text-amber-100" />
              </div>
              <span className="font-serif font-bold text-xl md:text-2xl bg-gradient-to-r from-amber-200 to-amber-300 bg-clip-text text-transparent tracking-tight">
                RentHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {navigation.map((item) => {
                const active = isActive(item.path);
                const isMessages = item.path === "/borrower/messages";
                return (
                  <Link key={item.name} to={item.path}>
                    <button
                      className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                        active
                          ? "bg-amber-800/40 text-amber-100 border border-amber-600/50 shadow-sm"
                          : "text-amber-200/90 hover:bg-amber-900/30 hover:text-amber-100"
                      }`}
                    >
                      <item.icon className="h-4.5 w-4.5" />
                      {item.name}
                      {isMessages && unreadCount > 0 && (
                        <span className="ml-1.5 bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center ring-2 ring-red-900/60">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </button>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop User Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <Link
                to="/borrower/profile"
                className="p-2.5 rounded-lg hover:bg-amber-900/30 text-amber-300 hover:text-amber-100 transition-colors"
                title="Profile"
              >
                <User className="h-5 w-5" />
              </Link>

              <button
                onClick={handleLogout}
                className="p-2.5 rounded-lg hover:bg-red-900/30 text-amber-300 hover:text-red-300 transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-lg hover:bg-amber-900/30 text-amber-300"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Sidebar / Menu */}
        {mobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute right-0 top-0 h-full w-72 bg-gradient-to-b from-gray-950 to-gray-900 border-l border-amber-900/40 shadow-2xl shadow-black/70 overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-amber-900/40">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-2xl bg-gradient-to-r from-amber-200 to-amber-300 bg-clip-text text-transparent">
                    RentHub
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-lg hover:bg-amber-900/30 text-amber-300"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <nav className="p-4 space-y-2">
                {navigation.map((item) => {
                  const active = isActive(item.path);
                  const isMessages = item.path === "/borrower/messages";
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-lg transition-all duration-200 ${
                        active
                          ? "bg-amber-800/40 text-amber-100 border border-amber-600/50"
                          : "text-amber-200/90 hover:bg-amber-900/30 hover:text-amber-100"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                      {isMessages && unreadCount > 0 && (
                        <span className="ml-auto bg-red-600 text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="pt-6 mt-4 border-t border-amber-900/30 space-y-2">
                  <Link
                    to="/borrower/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-amber-200/90 hover:bg-amber-900/30 hover:text-amber-100 transition-all"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3.5 rounded-lg text-red-300 hover:bg-red-950/40 hover:text-red-200 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Toaster position="top-center" richColors theme="dark" />
    </div>
  );
}
