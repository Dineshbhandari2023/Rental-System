import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import api from "../../utils/api";

const Verifications = () => {
  const [items, setItems] = useState([]);

  const fetch = async () => {
    try {
      // assuming you have an endpoint like /admin/verifications (you can adapt)
      const res = await api.get("/admin/users", {
        params: { page: 1, limit: 50 },
      });
      setItems(res.data.users.filter((u) => !u.isVerified));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const columns = [
    { key: "email", title: "Email" },
    {
      key: "name",
      title: "Name",
      render: (r) => `${r.firstName} ${r.lastName || ""}`,
    },
    {
      key: "doc",
      title: "Document",
      render: (r) => (r.verificationDoc ? "Uploaded" : "None"),
    },
  ];

  const approve = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/verify`, {});
      fetch();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Verification Requests</h1>
        </div>

        <Card>
          <DataTable
            columns={columns}
            data={items}
            renderRowActions={(row) => (
              <div className="flex gap-2 justify-end">
                <button
                  className="px-3 py-1 rounded bg-green-600 text-white"
                  onClick={() => approve(row._id)}
                >
                  Approve
                </button>
                <button className="px-3 py-1 rounded bg-red-50 text-red-600">
                  Reject
                </button>
              </div>
            )}
          />
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Verifications;
