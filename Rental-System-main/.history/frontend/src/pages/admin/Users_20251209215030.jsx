import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import DataTable from "../../components/ui/DataTable";
import Card from "../../components/ui/Card";
import api from "../../services/api";
import Pagination from "../../components/ui/Pagination";
import Modal from "../../components/ui/Modal";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchUsers = async (p = 1) => {
    setLoading(true);
    try {
      const res = await api.get("/admin/users", {
        params: { page: p, limit: 10 },
      });
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const columns = [
    { key: "email", title: "Email" },
    {
      key: "firstName",
      title: "Name",
      render: (r) => `${r.firstName} ${r.lastName || ""}`,
    },
    { key: "role", title: "Role" },
    {
      key: "isVerified",
      title: "Verified",
      render: (r) => (r.isVerified ? "Yes" : "No"),
    },
    {
      key: "createdAt",
      title: "Joined",
      render: (r) => new Date(r.createdAt).toLocaleDateString(),
    },
  ];

  const verifyUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/verify`, {});
      fetchUsers(page);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Users</h1>
        </div>

        <Card>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <DataTable
                columns={columns}
                data={users}
                renderRowActions={(row) => (
                  <div className="flex items-center gap-2 justify-end">
                    {!row.isVerified && (
                      <button
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded"
                        onClick={() => verifyUser(row._id)}
                      >
                        Verify
                      </button>
                    )}
                    <button
                      className="px-3 py-1 text-sm bg-red-50 text-red-600 border rounded"
                      onClick={() => setSelected(row)}
                    >
                      Deactivate
                    </button>
                  </div>
                )}
              />

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </Card>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Deactivate ${selected?.email}`}
      >
        <p>Are you sure you want to deactivate this user?</p>
        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={() => setSelected(null)}
            className="px-3 py-2 border rounded"
          >
            Cancel
          </button>
          <button className="px-3 py-2 bg-red-600 text-white rounded">
            Deactivate
          </button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminUsers;
