// import React, { useState } from "react";
// import { toast } from "sonner";
// import itemService from "../../services/itemService";
// import bookingService from "../../services/bookingService";

// export default function BookingForm({ item }) {
//   const [formData, setFormData] = useState({
//     startDate: "",
//     endDate: "",
//   });
//   const [submitting, setSubmitting] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);

//     try {
//       await bookingService.createBooking({
//         itemId: item._id,
//         startDate: formData.startDate,
//         endDate: formData.endDate,
//       });
//       toast.success("Booking request sent successfully!");
//       // Optionally redirect or refresh
//     } catch (error) {
//       toast.error(error.message || "Failed to send booking request");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Start Date</label>
//           <input
//             type="date"
//             name="startDate"
//             value={formData.startDate}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded-lg"
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium mb-1">End Date</label>
//           <input
//             type="date"
//             name="endDate"
//             value={formData.endDate}
//             onChange={handleChange}
//             required
//             className="w-full p-2 border rounded-lg"
//           />
//         </div>
//       </div>
//       <button
//         type="submit"
//         disabled={submitting}
//         className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//       >
//         {submitting ? "Submitting..." : "Request to Book"}
//       </button>
//     </form>
//   );
// }

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";
import itemService from "../../services/itemService";
import bookingService from "../../services/bookingService";
import authService from "../../services/authService";

export default function BookingForm({ item }) {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await bookingService.createBooking({
        itemId: item._id,
        startDate: formData.startDate,
        endDate: formData.endDate,
      });
      toast.success("Booking request sent successfully!");
      // Optionally redirect or refresh
    } catch (error) {
      toast.error(error.message || "Failed to send booking request");
    } finally {
      setSubmitting(false);
    }
  };

  const handleMessageLender = () => {
    // Build URL with query parameters
    const params = new URLSearchParams({
      userId: item.ownerId._id || item.ownerId,
      userName: item.ownerId.firstName
        ? `${item.ownerId.firstName} ${item.ownerId.lastName}`
        : "Lender",
    });

    // Navigate based on user role
    const basePath = currentUser.role === "lender" ? "/lender" : "/borrower";
    navigate(`${basePath}/messages?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              min={formData.startDate || new Date().toISOString().split("T")[0]}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition"
        >
          {submitting ? "Submitting..." : "Request to Book"}
        </button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">or</span>
        </div>
      </div>

      {/* Message Lender Button */}
      <button
        onClick={handleMessageLender}
        className="w-full py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 font-medium transition flex items-center justify-center gap-2"
      >
        <MessageCircle className="h-5 w-5" />
        Message Lender
      </button>
    </div>
  );
}
