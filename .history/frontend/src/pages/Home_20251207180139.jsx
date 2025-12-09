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
//       <div className="bg-gradient-to-br from-primary-50 to-white">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-24">
//           <div className="text-center">
//             <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
//               Share. Rent. <span className="text-primary-600">Connect.</span>
//             </h1>
//             <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
//               Join our community-driven platform where you can rent items you
//               need and lend items you don't use. Save money, reduce waste, and
//               build connections in your neighborhood.
//             </p>
//             <div className="mt-10 flex items-center justify-center gap-x-6">
//               <Link to="/register" className="btn-primary text-lg px-8 py-4">
//                 Get Started
//                 <ArrowRightIcon className="ml-2 h-5 w-5" />
//               </Link>
//               <Link to="/items" className="btn-secondary text-lg px-8 py-4">
//                 Browse Items
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features Section */}
//       <div className="bg-white py-24 sm:py-32">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//               Why Choose Community Rental Exchange?
//             </h2>
//             <p className="mt-4 text-lg text-gray-600">
//               A platform designed for trust, convenience, and community
//               building.
//             </p>
//           </div>
//           <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
//             {features.map((feature) => (
//               <div
//                 key={feature.name}
//                 className="card hover:shadow-lg transition-shadow duration-300"
//               >
//                 <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary-500">
//                   <feature.icon
//                     className="h-6 w-6 text-white"
//                     aria-hidden="true"
//                   />
//                 </div>
//                 <h3 className="mt-4 text-lg font-semibold text-gray-900">
//                   {feature.name}
//                 </h3>
//                 <p className="mt-2 text-gray-600">{feature.description}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* How It Works Section */}
//       <div className="bg-gray-50 py-24 sm:py-32">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//               How It Works
//             </h2>
//             <p className="mt-4 text-lg text-gray-600">
//               Simple steps to start sharing and renting in your community.
//             </p>
//           </div>
//           <div className="mt-16">
//             <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
//               {howItWorks.map((item) => (
//                 <div key={item.step} className="relative">
//                   <div className="flex flex-col items-center text-center">
//                     <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-2xl font-bold">
//                       {item.step}
//                     </div>
//                     <h3 className="mt-6 text-lg font-semibold text-gray-900">
//                       {item.title}
//                     </h3>
//                     <p className="mt-2 text-gray-600">{item.description}</p>
//                   </div>
//                   {item.step < 4 && (
//                     <div className="hidden lg:block absolute top-8 left-full -translate-x-1/2 w-full h-0.5 bg-primary-200" />
//                   )}
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Popular Categories */}
//       <div className="bg-white py-24 sm:py-32">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
//               Popular Categories
//             </h2>
//             <p className="mt-4 text-lg text-gray-600">
//               Find what you need across various categories
//             </p>
//           </div>
//           <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
//                 className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 text-center hover:border-primary-300 hover:shadow-md transition-all duration-300"
//               >
//                 <div className="mx-auto h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors duration-300">
//                   <div className="h-6 w-6 bg-primary-600 rounded"></div>
//                 </div>
//                 <h3 className="mt-4 text-sm font-medium text-gray-900">
//                   {category}
//                 </h3>
//                 <p className="mt-1 text-xs text-gray-500">Explore items</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* CTA Section */}
//       <div className="bg-primary-700">
//         <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
//               <span className="block">Ready to join the sharing economy?</span>
//             </h2>
//             <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
//               Start sharing, saving, and connecting with your community today.
//             </p>
//             <div className="mt-8 flex justify-center">
//               <Link
//                 to="/register"
//                 className="inline-flex items-center rounded-md bg-white px-6 py-3 text-lg font-medium text-primary-700 hover:bg-primary-50"
//               >
//                 Join Now
//                 <ArrowRightIcon className="ml-2 h-5 w-5" />
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
import FeatureCard from "../components/common/FeatureCard";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  MapPinIcon,
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        className="bg-gradient-to-br from-primary-50 via-white to-secondary-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-12 pb-24">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Share. Rent. <span className="text-primary-600">Connect.</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-3xl mx-auto">
              Join our community-driven platform where you can rent items you
              need and lend items you don't use. Save money, reduce waste, and
              build connections in your neighborhood.
            </p>
            <motion.div
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Link to="/register" className="btn-primary text-lg px-8 py-4">
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link to="/items" className="btn-secondary text-lg px-8 py-4">
                Browse Items
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose RentHub?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              A platform designed for trust, convenience, and community
              building.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.name}
                icon={feature.icon}
                title={feature.name}
                description={feature.description}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Simple steps to start sharing and renting in your community.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative text-center"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 text-2xl font-bold mx-auto"
                >
                  {item.step}
                </motion.div>
                <h3 className="mt-6 text-lg font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
                {item.step < 4 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-primary-200 -translate-x-1/2" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className="bg-primary-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to join the sharing economy?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
              Start sharing, saving, and connecting with your community today.
            </p>
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Link
                to="/register"
                className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-lg font-medium text-primary-700 hover:bg-primary-50 transition-colors"
              >
                Join Now
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
};

export default Home;
