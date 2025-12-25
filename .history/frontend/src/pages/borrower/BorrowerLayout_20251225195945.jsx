// import React, { useState } from "react";
// import { Link, useLocation, Outlet } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Search,
//   BookOpen,
//   Menu,
//   X,
//   LogOut,
//   User,
// } from "lucide-react";
// import { Toaster } from "sonner";
// const navigation = [
//   {
//     name: "Dashboard",
//     path: "/borrower/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     name: "Browse Rentals",
//     path: "/borrower/browse",
//     icon: Search,
//   },
//   {
//     name: "My Bookings",
//     path: "/borrower/bookings",
//     icon: BookOpen,
//   },
// ];

// export default function BorrowerLayout() {
//   const location = useLocation();
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   const isActive = (path) => {
//     return (
//       location.pathname === path || location.pathname.startsWith(path + "/")
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Top Navigation Bar */}
//       <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex h-16 items-center justify-between">
//             {/* Logo */}
//             <Link to="/borrower/dashboard" className="flex items-center gap-3">
//               <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
//                 <Search className="h-6 w-6 text-white" />
//               </div>
//               <span className="font-bold text-xl text-gray-900">
//                 RentHub Borrower
//               </span>
//             </Link>

//             {/* Desktop Navigation */}
//             <nav className="hidden md:flex items-center gap-2">
//               {navigation.map((item) => {
//                 const active = isActive(item.path);
//                 return (
//                   <Link key={item.name} to={item.path}>
//                     <button
//                       className={cn(
//                         "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors",
//                         active
//                           ? "bg-blue-600 text-white"
//                           : "text-gray-700 hover:bg-gray-100"
//                       )}
//                     >
//                       <item.icon className="h-4 w-4" />
//                       {item.name}
//                     </button>
//                   </Link>
//                 );
//               })}
//             </nav>

//             {/* Desktop User Actions */}
//             <div className="hidden md:flex items-center gap-2">
//               <button className="p-2 rounded-lg hover:bg-gray-100 transition">
//                 <User className="h-5 w-5 text-gray-700" />
//               </button>
//               <button className="p-2 rounded-lg hover:bg-gray-100 transition">
//                 <LogOut className="h-5 w-5 text-gray-700" />
//               </button>
//             </div>

//             {/* Mobile Menu Toggle */}
//             <button
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//               className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
//             >
//               {mobileMenuOpen ? (
//                 <X className="h-6 w-6 text-gray-700" />
//               ) : (
//                 <Menu className="h-6 w-6 text-gray-700" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation Panel */}
//         {mobileMenuOpen && (
//           <div className="md:hidden border-t border-gray-200 bg-white">
//             <nav className="max-w-7xl mx-auto px-4 py-4 space-y-2">
//               {navigation.map((item) => {
//                 const active = isActive(item.path);
//                 return (
//                   <Link
//                     key={item.name}
//                     to={item.path}
//                     onClick={() => setMobileMenuOpen(false)}
//                   >
//                     <button
//                       className={cn(
//                         "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left",
//                         active
//                           ? "bg-blue-600 text-white"
//                           : "text-gray-700 hover:bg-gray-100"
//                       )}
//                     >
//                       <item.icon className="h-5 w-5" />
//                       {item.name}
//                     </button>
//                   </Link>
//                 );
//               })}

//               <div className="pt-4 border-t border-gray-200 space-y-2">
//                 <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition text-left">
//                   <User className="h-5 w-5" />
//                   Profile
//                 </button>
//                 <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition text-left">
//                   <LogOut className="h-5 w-5" />
//                   Logout
//                 </button>
//               </div>
//             </nav>
//           </div>
//         )}
//       </header>

//       {/* Main Content Area */}
//       <main className="flex-1">
//         <Outlet /> {/* Renders child routes like dashboard, browse, etc. */}
//       </main>

//       {/* Toast Notifications */}
//       <Toaster position="top-right" />
//     </div>
//   );
// }

// // Helper function for class names (like shadcn's cn)
// function cn(...inputs) {
//   return inputs.filter(Boolean).join(" ");
// }

import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  BookOpen,
  Menu,
  X,
  LogOut,
  User,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import authService from "../../services/authService";

const navigation = [
  {
    name: "Dashboard",
    path: "/borrower/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Browse Rentals",
    path: "/borrower/browse",
    icon: Search,
  },
  {
    name: "My Bookings",
    path: "/borrower/bookings",
    icon: BookOpen,
  },
];

export default function BorrowerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    setMobileMenuOpen(false);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/borrower/dashboard" className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-600 flex items-center justify-center">
                <Search className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">RentHub</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link key={item.name} to={item.path}>
                    <button
                      className={cn(
                        "inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition",
                        active
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </button>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <Link to="/profile">
                <button className="p-2 rounded-lg hover:bg-gray-100">
                  <User className="h-5 w-5 text-gray-700" />
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5 text-gray-700" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <nav className="px-4 py-4 space-y-2">
              {navigation.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <button
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-left",
                        active
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </button>
                  </Link>
                );
              })}

              <div className="pt-4 border-t space-y-2">
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left">
                    <User className="h-5 w-5" />
                    Profile
                  </button>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 text-left text-red-600"
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

      {/* Toasts */}
      <Toaster position="top-right" />
    </div>
  );
}

/* Utility function */
function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
