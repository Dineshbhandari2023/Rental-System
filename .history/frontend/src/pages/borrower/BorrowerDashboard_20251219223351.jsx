// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { toast } from "sonner";
// import itemService from "../../services/itemService";
// import bookingService from "../../services/bookingService";
// import { Package, Clock, MapPin } from "lucide-react";

// export default function BorrowerDashboard() {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     activeBookings: 0,
//     pastBookings: 0,
//   });

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   const loadBookings = async () => {
//     try {
//       const data = await bookingService.getMyBookings({ page: 1, limit: 20 });
//       setBookings(data.bookings);
//       setStats({
//         activeBookings: bookingsData.filter((b) =>
//           ["pending", "confirmed", "ongoing"].includes(b.status)
//         ).length,
//         pastBookings: bookingsData.filter((b) =>
//           ["completed", "cancelled"].includes(b.status)
//         ).length,
//       });
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 md:py-12">
//       <div className="max-w-7xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">
//             Borrower Dashboard
//           </h1>
//           <p className="mt-2 text-gray-600">Manage your rentals and bookings</p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
//           <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <Clock className="h-6 w-6 text-blue-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Active Bookings</p>
//               <p className="text-3xl font-bold">{stats.activeBookings}</p>
//             </div>
//           </div>
//           <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
//             <div className="p-3 bg-green-100 rounded-lg">
//               <Package className="h-6 w-6 text-green-600" />
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Past Rentals</p>
//               <p className="text-3xl font-bold">{stats.pastBookings}</p>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="mb-10">
//           <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Link
//               to="/borrower/browse"
//               className="bg-blue-600 text-white p-6 rounded-xl flex items-center gap-4 hover:bg-blue-700 transition"
//             >
//               <MapPin className="h-8 w-8" />
//               <div>
//                 <p className="font-semibold text-lg">Browse Rentals</p>
//                 <p className="text-sm opacity-90">Find items near you</p>
//               </div>
//             </Link>
//             <button
//               onClick={loadBookings}
//               className="bg-white border p-6 rounded-xl flex items-center gap-4 hover:bg-gray-50 transition"
//             >
//               <Clock className="h-8 w-8 text-blue-600" />
//               <div className="text-left">
//                 <p className="font-semibold text-lg">Refresh Bookings</p>
//                 <p className="text-sm text-gray-600">Update your list</p>
//               </div>
//             </button>
//           </div>
//         </div>

//         {/* My Bookings */}
//         <div className="bg-white rounded-xl shadow-sm border">
//           <div className="p-6 border-b">
//             <h2 className="text-xl font-semibold">My Bookings</h2>
//           </div>
//           <div className="p-6">
//             {loading ? (
//               <div className="space-y-4">
//                 {[...Array(3)].map((_, i) => (
//                   <div
//                     key={i}
//                     className="h-24 bg-gray-100 rounded-lg animate-pulse"
//                   />
//                 ))}
//               </div>
//             ) : bookings.length === 0 ? (
//               <div className="text-center py-12">
//                 <Package className="mx-auto h-12 w-12 text-gray-400" />
//                 <p className="mt-4 text-gray-600">No bookings yet</p>
//                 <Link
//                   to="/borrower/browse"
//                   className="mt-2 text-blue-600 hover:underline"
//                 >
//                   Start browsing items
//                 </Link>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {bookings.map((booking) => (
//                   <Link
//                     key={booking._id}
//                     to={`/borrower/bookings/${booking._id}`}
//                     className="block p-4 border rounded-lg hover:bg-gray-50 transition"
//                   >
//                     <div className="flex flex-col md:flex-row justify-between gap-4">
//                       <div className="flex gap-4">
//                         <img
//                           src={booking.itemId.images[0]}
//                           alt={booking.itemId.title}
//                           className="h-16 w-16 object-cover rounded"
//                         />
//                         <div>
//                           <h3 className="font-semibold">
//                             {booking.itemId.title}
//                           </h3>
//                           <p className="text-sm text-gray-600">
//                             From:{" "}
//                             {new Date(booking.startDate).toLocaleDateString()}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             To: {new Date(booking.endDate).toLocaleDateString()}
//                           </p>
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-4">
//                         <span
//                           className={`px-3 py-1 rounded-full text-sm ${
//                             booking.status === "confirmed"
//                               ? "bg-green-100 text-green-800"
//                               : booking.status === "pending"
//                               ? "bg-yellow-100 text-yellow-800"
//                               : "bg-gray-100 text-gray-800"
//                           }`}
//                         >
//                           {booking.status.charAt(0).toUpperCase() +
//                             booking.status.slice(1)}
//                         </span>
//                         <p className="font-semibold">${booking.totalAmount}</p>
//                       </div>
//                     </div>
//                   </Link>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import bookingService from "../../services/bookingService";
import { Package, Clock, MapPin } from "lucide-react";

export default function BorrowerDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeBookings: 0,
    pastBookings: 0,
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL?.replace("/api", "");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);

      const data = await bookingService.getMyBookings({
        page: 1,
        limit: 20,
      });

      const bookingsData = data.bookings || [];
      setBookings(bookingsData);

      // Calculate stats
      setStats({
        activeBookings: bookingsData.filter((b) =>
          ["pending", "confirmed", "ongoing"].includes(b.status)
        ).length,
        pastBookings: bookingsData.filter((b) =>
          ["completed", "cancelled"].includes(b.status)
        ).length,
      });
    } catch (error) {
      toast.error(error.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_BASE_URL}${path}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Borrower Dashboard
          </h1>
          <p className="mt-2 text-gray-600">Manage your rentals and bookings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Bookings</p>
              <p className="text-3xl font-bold">{stats.activeBookings}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Past Rentals</p>
              <p className="text-3xl font-bold">{stats.pastBookings}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              to="/borrower/browse"
              className="bg-blue-600 text-white p-6 rounded-xl flex items-center gap-4 hover:bg-blue-700 transition"
            >
              <MapPin className="h-8 w-8" />
              <div>
                <p className="font-semibold text-lg">Browse Rentals</p>
                <p className="text-sm opacity-90">Find items near you</p>
              </div>
            </Link>

            <button
              onClick={loadBookings}
              className="bg-white border p-6 rounded-xl flex items-center gap-4 hover:bg-gray-50 transition"
            >
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-lg">Refresh Bookings</p>
                <p className="text-sm text-gray-600">Update your list</p>
              </div>
            </button>
          </div>
        </div>

        {/* My Bookings */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">My Bookings</h2>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-24 bg-gray-100 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600">No bookings yet</p>
                <Link
                  to="/borrower/browse"
                  className="mt-2 text-blue-600 hover:underline"
                >
                  Start browsing items
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Link
                    key={booking._id}
                    to={`/borrower/bookings/${booking._id}`}
                    className="block p-4 border rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex gap-4">
                        <img
                          src={getImageUrl(booking.itemId?.images?.[0])}
                          alt={booking.itemId?.title}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div>
                          <h3 className="font-semibold">
                            {booking.itemId?.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.startDate).toLocaleDateString()} →{" "}
                            {new Date(booking.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            booking.status === "confirmed"
                              ? "bg-green-100 text-green-800"
                              : booking.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {booking.status.charAt(0).toUpperCase() +
                            booking.status.slice(1)}
                        </span>
                        <p className="font-semibold">${booking.totalAmount}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
