// src/pages/admin/Users.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import adminService from "../../services/adminService";
import { toast } from "sonner";
import {
  Trash2,
  CheckCircle,
  UserCog,
  Search,
  Loader2,
  AlertTriangle,
  MoreVertical,
  UserX,
  UserCheck,
  ShieldCheck,
} from "lucide-react";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({}); // id → true/false
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUsers({ page, limit });
      setUsers(res.users || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  // ── Action Handlers ────────────────────────────────────────

  const handleAction = async (userId, actionFn, successMsg, errorPrefix) => {
    if (actionLoading[userId]) return;

    setActionLoading((prev) => ({ ...prev, [userId]: true }));

    try {
      await actionFn(userId);
      toast.success(successMsg);
      fetchUsers(); // refresh list
    } catch (err) {
      const msg = err.response?.data?.error || `${errorPrefix} failed`;
      toast.error(msg);
      console.error(`${errorPrefix} error:`, err);
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }));
      setOpenMenuId(null);
    }
  };

  const handleVerify = (userId) =>
    handleAction(
      userId,
      adminService.verifyUser,
      "User verified successfully",
      "Verification"
    );

  const handleDeactivate = (userId) =>
    handleAction(
      userId,
      adminService.deactivateUser,
      "User deactivated successfully",
      "Deactivation"
    );

  const handleActivate = (userId) =>
    handleAction(
      userId,
      adminService.activateUser,
      "User activated successfully",
      "Activation"
    );

  const handlePermanentDelete = async (userId, email) => {
    const confirmed = window.confirm(
      `PERMANENT DELETE WARNING!\n\nUser: ${email}\n\nThis action is irreversible.\nContinue?`
    );

    if (!confirmed) return;

    handleAction(
      userId,
      adminService.permanentDeleteUser,
      "User permanently deleted",
      "Permanent delete"
    );
  };

  // Filter
  const filteredUsers = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      `${u.firstName || ""} ${u.lastName || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-amber-100">
            Users Management
          </h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-gray-200 transition-colors"
          >
            ← Dashboard
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600/50 transition"
          />
        </div>

        {/* Table / Loading */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-800">
                <thead className="bg-gray-800/70">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Verified
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-16 text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const isLoading = actionLoading[user._id];

                      return (
                        <tr
                          key={user._id}
                          className="hover:bg-gray-800/40 transition-colors"
                        >
                          <td className="px-6 py-4 font-medium text-gray-200">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="px-6 py-4 text-gray-300">
                            {user.email}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${
                                user.role === "admin"
                                  ? "bg-purple-900/60 text-purple-300 border border-purple-700/40"
                                  : user.role === "lender"
                                  ? "bg-blue-900/60 text-blue-300 border border-blue-700/40"
                                  : "bg-gray-700/80 text-gray-200 border border-gray-600"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {user.isVerified ? (
                              <div className="flex items-center gap-1.5 text-emerald-400">
                                <CheckCircle className="h-4 w-4" />
                                <span>Verified</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 text-amber-400">
                                <AlertTriangle className="h-4 w-4" />
                                <span>Pending</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {user.isActive ? (
                              <span className="text-emerald-400 font-medium">
                                Active
                              </span>
                            ) : (
                              <span className="text-rose-400 font-medium">
                                Inactive
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-right relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenMenuId(
                                  openMenuId === user._id ? null : user._id
                                );
                              }}
                              disabled={isLoading}
                              className={`p-2 rounded-full transition-colors ${
                                isLoading
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-gray-700"
                              }`}
                            >
                              {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin text-amber-400" />
                              ) : (
                                <MoreVertical className="h-5 w-5 text-gray-400" />
                              )}
                            </button>

                            {openMenuId === user._id && (
                              <div
                                className="absolute right-2 top-10 z-50 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl py-2 text-sm"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {!user.isVerified && (
                                  <button
                                    onClick={() => handleVerify(user._id)}
                                    className="w-full text-left px-5 py-3 hover:bg-emerald-950/30 flex items-center gap-3 text-emerald-400 transition-colors"
                                  >
                                    <ShieldCheck className="h-4 w-4" />
                                    Verify User
                                  </button>
                                )}

                                <button
                                  onClick={() =>
                                    user.isActive
                                      ? handleDeactivate(user._id)
                                      : handleActivate(user._id)
                                  }
                                  className={`w-full text-left px-5 py-3 hover:bg-gray-800 flex items-center gap-3 transition-colors ${
                                    user.isActive
                                      ? "text-amber-400"
                                      : "text-emerald-400"
                                  }`}
                                >
                                  {user.isActive ? (
                                    <>
                                      <UserX className="h-4 w-4" /> Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <UserCheck className="h-4 w-4" /> Activate
                                    </>
                                  )}
                                </button>

                                {user.role !== "admin" && (
                                  <>
                                    <div className="my-1 border-t border-gray-800" />

                                    <button
                                      onClick={() =>
                                        handlePermanentDelete(
                                          user._id,
                                          user.email
                                        )
                                      }
                                      className="w-full text-left px-5 py-3 hover:bg-rose-950/40 flex items-center gap-3 text-rose-400 transition-colors"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Permanently Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
