// import React, { useEffect, useState } from "react";
// import AdminLayout from "../../components/layout/AdminLayout";
// import DataTable from "../../components/ui/DataTable";
// import Card from "../../components/ui/Card";
// import api from "../../services/api";
// import Pagination from "../../components/ui/Pagination";
// import Modal from "../../components/ui/Modal";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [selected, setSelected] = useState(null);

//   const fetchUsers = async (p = 1) => {
//     setLoading(true);
//     try {
//       const res = await api.get("/admin/users", {
//         params: { page: p, limit: 10 },
//       });
//       setUsers(res.data.users || []);
//       setTotalPages(res.data.totalPages || 1);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers(page);
//   }, [page]);

//   const columns = [
//     { key: "email", title: "Email" },
//     {
//       key: "firstName",
//       title: "Name",
//       render: (r) => `${r.firstName} ${r.lastName || ""}`,
//     },
//     { key: "role", title: "Role" },
//     {
//       key: "isVerified",
//       title: "Verified",
//       render: (r) => (r.isVerified ? "Yes" : "No"),
//     },
//     {
//       key: "createdAt",
//       title: "Joined",
//       render: (r) => new Date(r.createdAt).toLocaleDateString(),
//     },
//   ];

//   const verifyUser = async (userId) => {
//     try {
//       await api.put(`/admin/users/${userId}/verify`, {});
//       fetchUsers(page);
//     } catch (err) {
//       console.error(err);
//     }
//   };
//   return (
//     <AdminLayout>
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Users</h1>
//         </div>

//         <Card>
//           {loading ? (
//             <div>Loading...</div>
//           ) : (
//             <>
//               <DataTable
//                 columns={columns}
//                 data={users}
//                 renderRowActions={(row) => (
//                   <div className="flex items-center gap-2 justify-end">
//                     {!row.isVerified && (
//                       <button
//                         className="px-3 py-1 text-sm bg-green-600 text-white rounded"
//                         onClick={() => verifyUser(row._id)}
//                       >
//                         Verify
//                       </button>
//                     )}
//                     <button
//                       className="px-3 py-1 text-sm bg-red-50 text-red-600 border rounded"
//                       onClick={() => setSelected(row)}
//                     >
//                       Deactivate
//                     </button>
//                   </div>
//                 )}
//               />

//               <Pagination
//                 page={page}
//                 totalPages={totalPages}
//                 onPageChange={setPage}
//               />
//             </>
//           )}
//         </Card>
//       </div>

//       <Modal
//         open={!!selected}
//         onClose={() => setSelected(null)}
//         title={`Deactivate ${selected?.email}`}
//       >
//         <p>Are you sure you want to deactivate this user?</p>
//         <div className="mt-4 flex gap-2 justify-end">
//           <button
//             onClick={() => setSelected(null)}
//             className="px-3 py-2 border rounded"
//           >
//             Cancel
//           </button>
//           <button className="px-3 py-2 bg-red-600 text-white rounded">
//             Deactivate
//           </button>
//         </div>
//       </Modal>
//     </AdminLayout>
//   );
// };

// export default AdminUsers;

// src/pages/admin/Users.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/layout/AdminLayout";
import adminService from "../../services/adminService";
import { toast } from "sonner"; // or your toast library
import {
  Trash2,
  CheckCircle,
  UserCog,
  Search,
  Loader2,
  AlertTriangle,
} from "lucide-react";

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");

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

  const handleDeactivate = async (userId) => {
    if (
      !window.confirm(
        "Deactivate this user? They will no longer be able to log in."
      )
    )
      return;

    try {
      await adminService.deleteUser(userId);
      toast.success("User deactivated successfully");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to deactivate user");
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
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase())
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
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
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
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
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
                      Active
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-gray-300">
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
                        className="border-t border-gray-800 hover:bg-gray-800/50"
                      >
                        <td className="px-6 py-4">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="px-6 py-4 text-gray-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              user.role === "admin"
                                ? "bg-purple-900/50 text-purple-300"
                                : user.role === "lender"
                                ? "bg-blue-900/50 text-blue-300"
                                : "bg-gray-700 text-gray-300"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {user.isVerified ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {user.isActive ? (
                            <span className="text-emerald-400">Yes</span>
                          ) : (
                            <span className="text-rose-400">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 flex gap-3">
                          {!user.isVerified && (
                            <button
                              onClick={() => handleVerify(user._id)}
                              className="text-emerald-400 hover:text-emerald-300"
                              title="Verify user"
                            >
                              <CheckCircle className="h-5 w-5" />
                            </button>
                          )}
                          {user.isActive && (
                            <button
                              onClick={() => handleDeactivate(user._id)}
                              className="text-rose-400 hover:text-rose-300"
                              title="Deactivate user"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                          {user.role !== "admin" && (
                            <button
                              title="Make admin"
                              className="text-amber-400 hover:text-amber-300"
                            >
                              <UserCog className="h-5 w-5" />
                            </button>
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
