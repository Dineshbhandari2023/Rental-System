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
} from "lucide-react";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const handleDeactivate = async (userId, currentStatus) => {
    const action = currentStatus ? "deactivate" : "activate";
    if (!window.confirm(`Are you sure you want to ${action} this user?`))
      return;

    try {
      await adminService.toggleUserActive(userId, !currentStatus);
      toast.success(`User ${action}d successfully`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || `Failed to ${action} user`);
    }
  };

  const handlePermanentDelete = async (userId, email) => {
    if (
      !window.confirm(
        `PERMANENT DELETE WARNING!\n\nUser: ${email}\n\nThis action cannot be undone. Continue?`
      )
    )
      return;

    try {
      await adminService.permanentDeleteUser(userId);
      toast.success("User permanently deleted");
      fetchUsers();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to permanently delete user"
      );
    }
  };

  const handleVerify = async (userId) => {
    try {
      await adminService.verifyUser(userId);
      toast.success("User verified successfully");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to verify user");
    }
  };

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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-amber-100">
            Users Management
          </h1>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-600"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-10 w-10 animate-spin text-amber-500" />
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                      Name
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                      Email
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                      Role
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                      Verified
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-300">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-300 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              user.role === "admin"
                                ? "bg-purple-900/60 text-purple-300"
                                : user.role === "lender"
                                ? "bg-blue-900/60 text-blue-300"
                                : "bg-gray-700/80 text-gray-200"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.isVerified ? (
                            <div className="flex items-center gap-1.5 text-emerald-400">
                              <CheckCircle className="h-4 w-4" /> Verified
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-amber-400">
                              <AlertTriangle className="h-4 w-4" /> Pending
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
                            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
                          >
                            <MoreVertical className="h-5 w-5 text-gray-400" />
                          </button>

                          {openMenuId === user._id && (
                            <div
                              className="absolute right-4 top-10 z-50 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl py-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {!user.isVerified && (
                                <button
                                  onClick={() => {
                                    handleVerify(user._id);
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full text-left px-4 py-2.5 hover:bg-gray-800 flex items-center gap-2 text-emerald-400"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Verify User
                                </button>
                              )}

                              <button
                                onClick={() => {
                                  handleDeactivate(user._id, user.isActive);
                                  setOpenMenuId(null);
                                }}
                                className={`w-full text-left px-4 py-2.5 hover:bg-gray-800 flex items-center gap-2 ${
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
                                  <div className="border-t border-gray-700 my-1" />

                                  <button
                                    onClick={() => {
                                      handlePermanentDelete(
                                        user._id,
                                        user.email
                                      );
                                      setOpenMenuId(null);
                                    }}
                                    className="w-full text-left px-4 py-2.5 hover:bg-rose-950/50 flex items-center gap-2 text-rose-400"
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
                    ))
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
