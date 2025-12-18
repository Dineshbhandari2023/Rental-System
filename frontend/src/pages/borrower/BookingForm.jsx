import React, { useState } from "react";
import { toast } from "sonner";
import itemService from "../../services/itemService";
import bookingService from "../../services/bookingService";

export default function BookingForm({ item }) {
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

  return (
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
            className="w-full p-2 border rounded-lg"
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
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Submitting..." : "Request to Book"}
      </button>
    </form>
  );
}
