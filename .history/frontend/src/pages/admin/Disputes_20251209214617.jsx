import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import api from "../../utils/api";

const AdminDisputes = () => {
  const [disputes, setDisputes] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/disputes");
        setDisputes(res.data.disputes || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const columns = [
    { key: "title", title: "Title" },
    { key: "user", title: "Opened By", render: (r) => r.user?.email },
    { key: "status", title: "Status" },
    {
      key: "createdAt",
      title: "Date",
      render: (r) => new Date(r.createdAt).toLocaleString(),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Disputes</h1>
        <Card>
          <DataTable columns={columns} data={disputes} />
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDisputes;
