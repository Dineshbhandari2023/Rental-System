// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";
// import {
//   Bars3Icon,
//   XMarkIcon,
//   UserCircleIcon,
//   HomeIcon,
//   ShoppingBagIcon,
//   Cog6ToothIcon,
//   ArrowRightOnRectangleIcon,
// } from "@heroicons/react/24/outline";

// const Header = () => {
//   const { user, logout, isAdmin } = useAuth();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/login");
//   };

//   const API_BASE_URL = import.meta.env.VITE_BACKEND_URL?.replace("/api", "");
//   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

//   const navItems = [
//     { name: "Home", path: "/", icon: HomeIcon },
//     { name: "Browse Items", path: "/items", icon: ShoppingBagIcon },
//   ];

//   const userMenuItems = user
//     ? [
//         { name: "Dashboard", path: "/dashboard", icon: UserCircleIcon },
//         { name: "Profile", path: "/profile", icon: Cog6ToothIcon },
//         ...(isAdmin()
//           ? [{ name: "Admin", path: "/admin", icon: Cog6ToothIcon }]
//           : []),
//         {
//           name: "Logout",
//           onClick: handleLogout,
//           icon: ArrowRightOnRectangleIcon,
//           className: "text-red-800 hover:text-red-950",
//         },
//       ]
//     : [
//         { name: "Login", path: "/login", icon: ArrowRightOnRectangleIcon },
//         { name: "Register", path: "/register", icon: UserCircleIcon },
//       ];
//   const profileImageUrl = user?.profilePicture?.startsWith("http")
//     ? user.profilePicture
//     : `${API_BASE_URL}${user?.profilePicture}`;

//   return (
//     <header className="bg-amber-50 shadow-md border-b-4 border-amber-800">
//       <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="flex h-20 justify-between items-center">
//           {/* Logo */}
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center space-x-3">
//               <div className="w-12 h-12 bg-amber-800 rounded-sm flex items-center justify-center border-2 border-amber-900">
//                 <ShoppingBagIcon className="h-6 w-6 text-amber-50" />
//               </div>
//               <span className="text-2xl font-serif font-bold text-amber-900">
//                 {import.meta.env.REACT_APP_SITE_NAME || "Community Rental"}
//               </span>
//             </Link>
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex md:items-center md:space-x-8">
//             {navItems.map((item) => (
//               <Link
//                 key={item.name}
//                 to={item.path}
//                 className="text-amber-900 hover:text-amber-950 font-serif font-semibold text-lg underline decoration-dotted hover:decoration-solid transition-all duration-200"
//               >
//                 {item.name}
//               </Link>
//             ))}

//             {/* User menu */}
//             <div className="relative group">
//               <button className="flex items-center space-x-2 text-amber-900 hover:text-amber-950 border-2 border-amber-800 px-4 py-2 bg-amber-100 hover:bg-amber-200 transition-colors">
//                 {user ? (
//                   <>
//                     {user.profilePicture ? (
//                       <img
//                         src={
//                           BACKEND_URL
//                             ? `${BACKEND_URL.replace(/\/$/, "")}${
//                                 user.profilePicture
//                               }`
//                             : user.profilePicture
//                         }
//                         alt="Profile"
//                         className="h-8 w-8 rounded-full object-cover border-2 border-amber-800"
//                         onError={(e) => {
//                           e.currentTarget.src =
//                             "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
//                         }}
//                       />
//                     ) : (
//                       <UserCircleIcon className="h-6 w-6" />
//                     )}

//                     <span className="font-serif font-semibold">
//                       {user.firstName}
//                     </span>
//                   </>
//                 ) : (
//                   <>
//                     <UserCircleIcon className="h-6 w-6" />
//                     <span className="font-serif font-semibold">Account</span>
//                   </>
//                 )}
//               </button>

//               {/* Dropdown menu */}
//               <div className="absolute right-0 mt-2 w-56 bg-amber-50 border-4 border-amber-800 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
//                 {userMenuItems.map((item) =>
//                   item.onClick ? (
//                     <button
//                       key={item.name}
//                       onClick={item.onClick}
//                       className={`w-full text-left px-4 py-3 text-base font-serif hover:bg-amber-100 flex items-center space-x-2 border-b border-amber-300 ${
//                         item.className || "text-amber-900"
//                       }`}
//                     >
//                       <item.icon className="h-5 w-5" />
//                       <span>{item.name}</span>
//                     </button>
//                   ) : (
//                     <Link
//                       key={item.name}
//                       to={item.path}
//                       className="block px-4 py-3 text-base font-serif text-amber-900 hover:bg-amber-100 flex items-center space-x-2 border-b border-amber-300"
//                     >
//                       <item.icon className="h-5 w-5" />
//                       <span>{item.name}</span>
//                     </Link>
//                   )
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="p-2 text-amber-900 hover:text-amber-950 border-2 border-amber-800 bg-amber-100"
//             >
//               {isMenuOpen ? (
//                 <XMarkIcon className="h-6 w-6" />
//               ) : (
//                 <Bars3Icon className="h-6 w-6" />
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {isMenuOpen && (
//           <div className="md:hidden py-4 border-t-2 border-amber-800">
//             <div className="space-y-2">
//               {navItems.map((item) => (
//                 <Link
//                   key={item.name}
//                   to={item.path}
//                   className="block px-3 py-2 text-amber-900 hover:text-amber-950 font-serif font-semibold hover:bg-amber-100"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {item.name}
//                 </Link>
//               ))}

//               <div className="border-t-2 border-amber-800 pt-2 mt-2">
//                 {userMenuItems.map((item) =>
//                   item.onClick ? (
//                     <button
//                       key={item.name}
//                       onClick={() => {
//                         item.onClick();
//                         setIsMenuOpen(false);
//                       }}
//                       className={`block w-full text-left px-3 py-2 text-base font-serif hover:bg-amber-100 ${
//                         item.className || "text-amber-900"
//                       }`}
//                     >
//                       {item.name}
//                     </button>
//                   ) : (
//                     <Link
//                       key={item.name}
//                       to={item.path}
//                       className="block px-3 py-2 text-base font-serif text-amber-900 hover:bg-amber-100"
//                       onClick={() => setIsMenuOpen(false)}
//                     >
//                       {item.name}
//                     </Link>
//                   )
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </nav>
//     </header>
//   );
// };

// export default Header;

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
          className: "text-red-400 hover:text-red-300",
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
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl border-b-2 border-amber-700/30 sticky top-0 z-50 backdrop-blur-sm">
      {/* Decorative top line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent" />

      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          {/* Logo */}
          <motion.div
            className="flex items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.6 }}
                className="relative w-12 h-12 bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center border-2 border-amber-600 shadow-lg shadow-amber-900/50"
              >
                <ShoppingBagIcon className="h-6 w-6 text-amber-100" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-amber-500" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-amber-500" />
              </motion.div>
              <span className="text-2xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 group-hover:from-amber-200 group-hover:via-amber-100 group-hover:to-amber-200 transition-all duration-300">
                {import.meta.env.REACT_APP_SITE_NAME || "Community Rental"}
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={item.path}
                  className="relative text-amber-300 hover:text-amber-200 font-serif font-semibold text-lg transition-all duration-200 group"
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            ))}

            {/* User menu */}
            <div className="relative group">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 text-amber-300 hover:text-amber-200 border-2 border-amber-700 px-4 py-2 bg-gradient-to-r from-slate-800 to-slate-900 hover:border-amber-600 transition-all shadow-lg shadow-slate-900/50"
              >
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
                        className="h-8 w-8 rounded-full object-cover border-2 border-amber-600"
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
              </motion.button>

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-56 bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-700/50 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 backdrop-blur-sm">
                {userMenuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.onClick ? (
                      <button
                        onClick={item.onClick}
                        className={`w-full text-left px-4 py-3 text-base font-serif hover:bg-slate-700/50 flex items-center space-x-2 border-b border-amber-900/30 ${
                          item.className ||
                          "text-amber-300 hover:text-amber-200"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className="block px-4 py-3 text-base font-serif text-amber-300 hover:text-amber-200 hover:bg-slate-700/50 flex items-center space-x-2 border-b border-amber-900/30"
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-amber-300 hover:text-amber-200 border-2 border-amber-700 bg-gradient-to-r from-slate-800 to-slate-900 hover:border-amber-600 transition-all"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t-2 border-amber-900/30 overflow-hidden"
            >
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={item.path}
                      className="block px-3 py-2 text-amber-300 hover:text-amber-200 font-serif font-semibold hover:bg-slate-800/50 transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="border-t-2 border-amber-900/30 pt-2 mt-2">
                  {userMenuItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navItems.length + index) * 0.1 }}
                    >
                      {item.onClick ? (
                        <button
                          onClick={() => {
                            item.onClick();
                            setIsMenuOpen(false);
                          }}
                          className={`block w-full text-left px-3 py-2 text-base font-serif hover:bg-slate-800/50 transition-all ${
                            item.className ||
                            "text-amber-300 hover:text-amber-200"
                          }`}
                        >
                          {item.name}
                        </button>
                      ) : (
                        <Link
                          to={item.path}
                          className="block px-3 py-2 text-base font-serif text-amber-300 hover:text-amber-200 hover:bg-slate-800/50 transition-all"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};

export default Header;
