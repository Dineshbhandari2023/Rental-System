import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/layout/Layout";
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

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-amber-100 border-b-4 border-amber-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center">
            <h1 className="text-5xl font-serif font-bold tracking-tight text-amber-950 sm:text-7xl">
              Share. Rent.{" "}
              <span className="text-amber-800 italic">Connect.</span>
            </h1>
            <p className="mt-8 text-xl leading-relaxed text-amber-900 max-w-3xl mx-auto font-serif">
              Join our community-driven platform where you can rent items you
              need and lend items you don't use. Save money, reduce waste, and
              build connections in your neighborhood.
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="inline-flex items-center bg-amber-800 text-amber-50 font-serif font-bold text-lg px-10 py-4 border-4 border-amber-950 hover:bg-amber-900 transition-colors shadow-lg"
              >
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/items"
                className="inline-flex items-center bg-amber-50 text-amber-900 font-serif font-bold text-lg px-10 py-4 border-4 border-amber-800 hover:bg-amber-100 transition-colors shadow-lg"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-stone-100 py-20 sm:py-24 border-b-4 border-amber-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-serif font-bold tracking-tight text-amber-950 sm:text-5xl">
              Why Choose Community Rental Exchange?
            </h2>
            <p className="mt-6 text-xl text-amber-900 font-serif italic">
              A platform designed for trust, convenience, and community
              building.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="bg-amber-50 border-4 border-amber-800 p-8 hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="flex items-center justify-center h-14 w-14 border-4 border-amber-900 bg-amber-800">
                  <feature.icon
                    className="h-7 w-7 text-amber-50"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-6 text-xl font-serif font-bold text-amber-950">
                  {feature.name}
                </h3>
                <p className="mt-3 text-amber-900 font-serif leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="bg-amber-50 py-20 sm:py-24 border-b-4 border-amber-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-serif font-bold tracking-tight text-amber-950 sm:text-5xl">
              How It Works
            </h2>
            <p className="mt-6 text-xl text-amber-900 font-serif italic">
              Simple steps to start sharing and renting in your community.
            </p>
          </div>
          <div className="mt-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
              {howItWorks.map((item) => (
                <div key={item.step} className="relative">
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-20 w-20 items-center justify-center border-4 border-amber-900 bg-amber-100 text-amber-950 text-3xl font-serif font-bold">
                      {item.step}
                    </div>
                    <h3 className="mt-6 text-xl font-serif font-bold text-amber-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-amber-900 font-serif leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {item.step < 4 && (
                    <div className="hidden lg:block absolute top-10 left-full -translate-x-1/2 w-full h-1 bg-amber-800" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular Categories */}
      <div className="bg-stone-100 py-20 sm:py-24 border-b-4 border-amber-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-serif font-bold tracking-tight text-amber-950 sm:text-5xl">
              Popular Categories
            </h2>
            <p className="mt-6 text-xl text-amber-900 font-serif italic">
              Find what you need across various categories
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
            {[
              "Tools",
              "Electronics",
              "Sports",
              "Books",
              "Vehicles",
              "Furniture",
            ].map((category) => (
              <div
                key={category}
                className="group relative overflow-hidden border-4 border-amber-800 bg-amber-50 p-6 text-center hover:bg-amber-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="mx-auto h-14 w-14 border-4 border-amber-900 bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors duration-300">
                  <div className="h-8 w-8 bg-amber-800"></div>
                </div>
                <h3 className="mt-4 text-base font-serif font-bold text-amber-950">
                  {category}
                </h3>
                <p className="mt-2 text-xs font-serif text-amber-800 italic">
                  Explore items
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-amber-800 border-b-4 border-amber-950">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="text-center">
            <h2 className="text-4xl font-serif font-bold tracking-tight text-amber-50 sm:text-5xl">
              <span className="block">Ready to join the sharing economy?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-amber-100 font-serif italic">
              Start sharing, saving, and connecting with your community today.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                to="/register"
                className="inline-flex items-center bg-amber-50 px-10 py-4 text-xl font-serif font-bold text-amber-900 border-4 border-amber-950 hover:bg-amber-100 shadow-2xl transition-colors"
              >
                Join Now
                <ArrowRightIcon className="ml-2 h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
