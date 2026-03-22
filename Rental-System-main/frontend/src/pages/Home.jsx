// import React from "react";
// import { Link } from "react-router-dom";
// import Layout from "../components/layout/Layout";
// import {
//   ArrowRightIcon,
//   ShieldCheckIcon,
//   CurrencyDollarIcon,
//   UserGroupIcon,
//   ChatBubbleLeftRightIcon,
//   MapPinIcon,
// } from "@heroicons/react/24/outline";

// const Home = () => {
//   const features = [
//     {
//       name: "Secure Platform",
//       description:
//         "Verified users, secure payments, and built-in insurance for peace of mind.",
//       icon: ShieldCheckIcon,
//     },
//     {
//       name: "Save Money",
//       description:
//         "Rent items for a fraction of the cost of buying. No more expensive purchases.",
//       icon: CurrencyDollarIcon,
//     },
//     {
//       name: "Earn Money",
//       description:
//         "Turn your unused items into income. List what you have and start earning.",
//       icon: CurrencyDollarIcon,
//     },
//     {
//       name: "Community Trust",
//       description: "Built on reviews and ratings from real community members.",
//       icon: UserGroupIcon,
//     },
//     {
//       name: "Easy Communication",
//       description: "Built-in messaging system for seamless coordination.",
//       icon: ChatBubbleLeftRightIcon,
//     },
//     {
//       name: "Local Focus",
//       description:
//         "Connect with people in your neighborhood. Reduce environmental impact.",
//       icon: MapPinIcon,
//     },
//   ];

//   const howItWorks = [
//     {
//       step: 1,
//       title: "Sign Up",
//       description: "Create your free account as a borrower, lender, or both.",
//     },
//     {
//       step: 2,
//       title: "Browse or List",
//       description: "Find items you need or list items you want to share.",
//     },
//     {
//       step: 3,
//       title: "Connect",
//       description: "Message the owner, agree on terms, and schedule pickup.",
//     },
//     {
//       step: 4,
//       title: "Enjoy",
//       description: "Use the item and return it as agreed. Leave a review!",
//     },
//   ];

//   return (
//     <Layout>
//       {/* Hero Section */}
//       <div className="bg-amber-100 border-b-4 border-amber-800">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
//           <div className="text-center">
//             <h1 className="text-5xl font-serif font-bold tracking-tight text-amber-950 sm:text-7xl">
//               Share. Rent.{" "}
//               <span className="text-amber-800 italic">Connect.</span>
//             </h1>
//             <p className="mt-8 text-xl leading-relaxed text-amber-900 max-w-3xl mx-auto font-serif">
//               Join our community-driven platform where you can rent items you
//               need and lend items you don't use. Save money, reduce waste, and
//               build connections in your neighborhood.
//             </p>
//             <div className="mt-12 flex items-center justify-center gap-x-6">
//               <Link
//                 to="/register"
//                 className="inline-flex items-center bg-amber-800 text-amber-50 font-serif font-bold text-lg px-10 py-4 border-4 border-amber-950 hover:bg-amber-900 transition-colors shadow-lg"
//               >
//                 Get Started
//                 <ArrowRightIcon className="ml-2 h-5 w-5" />
//               </Link>
//               <Link
//                 to="/items"
//                 className="inline-flex items-center bg-amber-50 text-amber-900 font-serif font-bold text-lg px-10 py-4 border-4 border-amber-800 hover:bg-amber-100 transition-colors shadow-lg"
//               >
//                 Browse Items
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="bg-stone-100 py-20 sm:py-24 border-b-4 border-amber-800">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-4xl font-serif font-bold tracking-tight text-amber-950 sm:text-5xl">
//               Why Choose Community Rental Exchange?
//             </h2>
//             <p className="mt-6 text-xl text-amber-900 font-serif italic">
//               A platform designed for trust, convenience, and community
//               building.
//             </p>
//           </div>
//           <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//             {features.map((feature) => (
//               <div
//                 key={feature.name}
//                 className="bg-amber-50 border-4 border-amber-800 p-8 hover:shadow-2xl transition-shadow duration-300"
//               >
//                 <div className="flex items-center justify-center h-14 w-14 border-4 border-amber-900 bg-amber-800">
//                   <feature.icon
//                     className="h-7 w-7 text-amber-50"
//                     aria-hidden="true"
//                   />
//                 </div>
//                 <h3 className="mt-6 text-xl font-serif font-bold text-amber-950">
//                   {feature.name}
//                 </h3>
//                 <p className="mt-3 text-amber-900 font-serif leading-relaxed">
//                   {feature.description}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* How It Works Section */}
//       <div className="bg-amber-50 py-20 sm:py-24 border-b-4 border-amber-800">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-4xl font-serif font-bold tracking-tight text-amber-950 sm:text-5xl">
//               How It Works
//             </h2>
//             <p className="mt-6 text-xl text-amber-900 font-serif italic">
//               Simple steps to start sharing and renting in your community.
//             </p>
//           </div>
//           <div className="mt-16">
//             <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
//               {howItWorks.map((item) => (
//                 <div key={item.step} className="relative">
//                   <div className="flex flex-col items-center text-center">
//                     <div className="flex h-20 w-20 items-center justify-center border-4 border-amber-900 bg-amber-100 text-amber-950 text-3xl font-serif font-bold">
//                       {item.step}
//                     </div>
//                     <h3 className="mt-6 text-xl font-serif font-bold text-amber-950">
//                       {item.title}
//                     </h3>
//                     <p className="mt-3 text-amber-900 font-serif leading-relaxed">
//                       {item.description}
//                     </p>
//                   </div>
//                   {item.step < 4 && (
//                     <div className="hidden lg:block absolute top-10 left-full -translate-x-1/2 w-full h-1 bg-amber-800" />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Popular Categories */}
//       <div className="bg-stone-100 py-20 sm:py-24 border-b-4 border-amber-800">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-4xl font-serif font-bold tracking-tight text-amber-950 sm:text-5xl">
//               Popular Categories
//             </h2>
//             <p className="mt-6 text-xl text-amber-900 font-serif italic">
//               Find what you need across various categories
//             </p>
//           </div>
//           <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
//             {[
//               "Tools",
//               "Electronics",
//               "Sports",
//               "Books",
//               "Vehicles",
//               "Furniture",
//             ].map((category) => (
//               <div
//                 key={category}
//                 className="group relative overflow-hidden border-4 border-amber-800 bg-amber-50 p-6 text-center hover:bg-amber-100 hover:shadow-xl transition-all duration-300"
//               >
//                 <div className="mx-auto h-14 w-14 border-4 border-amber-900 bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors duration-300">
//                   <div className="h-8 w-8 bg-amber-800"></div>
//                 </div>
//                 <h3 className="mt-4 text-base font-serif font-bold text-amber-950">
//                   {category}
//                 </h3>
//                 <p className="mt-2 text-xs font-serif text-amber-800 italic">
//                   Explore items
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="bg-amber-800 border-b-4 border-amber-950">
//         <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
//           <div className="text-center">
//             <h2 className="text-4xl font-serif font-bold tracking-tight text-amber-50 sm:text-5xl">
//               <span className="block">Ready to join the sharing economy?</span>
//             </h2>
//             <p className="mx-auto mt-6 max-w-2xl text-xl text-amber-100 font-serif italic">
//               Start sharing, saving, and connecting with your community today.
//             </p>
//             <div className="mt-10 flex justify-center">
//               <Link
//                 to="/register"
//                 className="inline-flex items-center bg-amber-50 px-10 py-4 text-xl font-serif font-bold text-amber-900 border-4 border-amber-950 hover:bg-amber-100 shadow-2xl transition-colors"
//               >
//                 Join Now
//                 <ArrowRightIcon className="ml-2 h-6 w-6" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Home;

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "../components/layout/Layout";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
  const features = [
    {
      name: "Secure Platform",
      description:
        "Verified users, secure payments, and built-in insurance for peace of mind.",
      icon: ShieldCheckIcon,
    },
    {
      name: "Save Money",
      description:
        "Rent items for a fraction of the cost of buying. No more expensive purchases.",
      icon: CurrencyDollarIcon,
    },
    {
      name: "Earn Money",
      description:
        "Turn your unused items into income. List what you have and start earning.",
      icon: CurrencyDollarIcon,
    },
    {
      name: "Community Trust",
      description: "Built on reviews and ratings from real community members.",
      icon: UserGroupIcon,
    },
    {
      name: "Easy Communication",
      description: "Built-in messaging system for seamless coordination.",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      name: "Local Focus",
      description:
        "Connect with people in your neighborhood. Reduce environmental impact.",
      icon: MapPinIcon,
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Sign Up",
      description: "Create your free account as a borrower, lender, or both.",
    },
    {
      step: 2,
      title: "Browse or List",
      description: "Find items you need or list items you want to share.",
    },
    {
      step: 3,
      title: "Connect",
      description: "Message the owner, agree on terms, and schedule pickup.",
    },
    {
      step: 4,
      title: "Enjoy",
      description: "Use the item and return it as agreed. Leave a review!",
    },
  ];

  const categories = [
    { name: "Tools", icon: "🔧" },
    { name: "Electronics", icon: "📱" },
    { name: "Sports", icon: "⚽" },
    { name: "Books", icon: "📚" },
    { name: "Vehicles", icon: "🚗" },
    { name: "Furniture", icon: "🛋️" },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 border-b-2 border-amber-700/30 overflow-hidden">
        {/* Vintage texture overlay */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 border-2 border-amber-600/20 rounded-full"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-16 h-16 border-2 border-amber-600/20"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-32 relative z-10">
          <motion.div
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900/30 border border-amber-700/50 text-amber-300 text-sm font-serif backdrop-blur-sm">
                <SparklesIcon className="w-4 h-4" />
                Vintage Community Sharing
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-8xl font-serif font-bold tracking-tight text-amber-100 sm:text-8xl mb-8"
            >
              Share. Rent.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 italic">
                Connect.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mt-8 text-xl leading-relaxed text-amber-200/90 max-w-3xl mx-auto font-serif"
            >
              Join our community-driven platform where you can rent items you
              need and lend items you don't use. Save money, reduce waste, and
              build connections in your neighborhood.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="group inline-flex items-center bg-gradient-to-r from-amber-600 to-amber-700 text-white font-serif font-bold text-lg px-10 py-4 border-2 border-amber-500 hover:border-amber-400 transition-all shadow-lg shadow-amber-900/50 hover:shadow-amber-700/50 relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  <span className="relative z-10">Get Started</span>
                  <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/items"
                  className="inline-flex items-center bg-transparent text-amber-300 font-serif font-bold text-lg px-10 py-4 border-2 border-amber-700 hover:bg-amber-900/30 hover:border-amber-600 transition-all shadow-lg backdrop-blur-sm"
                >
                  Browse Items
                </Link>
              </motion.div>
            </motion.div>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-16 mx-auto w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent"
            />
          </motion.div>
        </div>

        {/* Bottom wave decoration */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 50L60 45C120 40 240 30 360 35C480 40 600 60 720 65C840 70 960 60 1080 50C1200 40 1320 30 1380 25L1440 20V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z"
              fill="#1e293b"
            />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-900 py-24 sm:py-32 border-b border-amber-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-serif font-bold tracking-tight text-amber-100 sm:text-6xl mb-6">
              Why Choose Us?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-6" />
            <p className="text-xl text-amber-300/80 font-serif italic max-w-2xl mx-auto">
              A platform designed for trust, convenience, and community building
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-amber-900/30 p-8 hover:border-amber-700/50 transition-all duration-300 overflow-hidden"
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-amber-700/30 group-hover:border-amber-600/50 transition-colors" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-amber-700/30 group-hover:border-amber-600/50 transition-colors" />

                <div className="flex items-center justify-center h-16 w-16 border-2 border-amber-700/50 bg-gradient-to-br from-amber-900/50 to-amber-950/50 group-hover:border-amber-600 group-hover:shadow-lg group-hover:shadow-amber-900/50 transition-all duration-300">
                  <feature.icon
                    className="h-8 w-8 text-amber-400 group-hover:text-amber-300 transition-colors"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-6 text-xl font-serif font-bold text-amber-100 group-hover:text-amber-200 transition-colors">
                  {feature.name}
                </h3>
                <p className="mt-3 text-amber-300/70 font-serif leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-24 sm:py-32 border-b border-amber-900/20 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgb(217, 119, 6) 1px, transparent 0)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-5xl font-serif font-bold tracking-tight text-amber-100 sm:text-6xl mb-6">
              How It Works
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-6" />
            <p className="text-xl text-amber-300/80 font-serif italic max-w-2xl mx-auto">
              Simple steps to start sharing and renting in your community
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4"
          >
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                variants={itemVariants}
                className="relative group"
              >
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="relative flex h-24 w-24 items-center justify-center border-2 border-amber-700 bg-gradient-to-br from-amber-900/50 to-amber-950/50 text-amber-300 text-4xl font-serif font-bold group-hover:border-amber-600 group-hover:shadow-lg group-hover:shadow-amber-900/50 transition-all duration-300"
                  >
                    {item.step}
                    <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600/50" />
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600/50" />
                  </motion.div>

                  <h3 className="mt-6 text-2xl font-serif font-bold text-amber-100 group-hover:text-amber-200 transition-colors">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-amber-300/70 font-serif leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Connector line for desktop */}
                {index < howItWorks.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-amber-700/50 to-transparent origin-left"
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-slate-900 py-24 sm:py-32 border-b border-amber-900/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-serif font-bold tracking-tight text-amber-100 sm:text-6xl mb-6">
              Popular Categories
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mb-6" />
            <p className="text-xl text-amber-300/80 font-serif italic">
              Find what you need across various categories
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6"
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group relative overflow-hidden border-2 border-amber-900/30 bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-center hover:border-amber-700/50 transition-all duration-300 cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/0 to-amber-900/0 group-hover:from-amber-900/10 group-hover:to-transparent transition-all duration-300" />

                <div className="relative">
                  <div className="mx-auto h-16 w-16 border-2 border-amber-700/50 bg-gradient-to-br from-amber-900/30 to-amber-950/30 flex items-center justify-center group-hover:border-amber-600 group-hover:shadow-lg group-hover:shadow-amber-900/50 transition-all duration-300">
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <h3 className="mt-4 text-lg font-serif font-bold text-amber-100 group-hover:text-amber-200 transition-colors">
                    {category.name}
                  </h3>
                  <p className="mt-2 text-xs font-serif text-amber-400/70 italic group-hover:text-amber-300/90 transition-colors">
                    Explore items
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-amber-950 via-amber-900 to-amber-950 border-b-2 border-amber-800 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-amber-400 rotate-45" />
          <div className="absolute bottom-10 right-10 w-40 h-40 border-4 border-amber-400" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center"
          >
            <h2 className="text-5xl font-serif font-bold tracking-tight text-amber-50 sm:text-6xl mb-6">
              Ready to join the sharing economy?
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mb-8" />
            <p className="mx-auto max-w-2xl text-xl text-amber-100 font-serif italic mb-10">
              Start sharing, saving, and connecting with your community today.
            </p>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/register"
                className="group inline-flex items-center bg-amber-100 px-12 py-5 text-xl font-serif font-bold text-amber-900 border-4 border-amber-200 hover:bg-white hover:border-amber-100 shadow-2xl shadow-amber-950/50 hover:shadow-amber-800/50 transition-all relative overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Join Now</span>
                <ArrowRightIcon className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform relative z-10" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
