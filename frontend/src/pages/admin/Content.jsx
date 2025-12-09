import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import api from "../../services/api";

const AdminContent = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/content");
        setItems(res.data.items || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const columns = [
    { key: "title", title: "Title" },
    { key: "type", title: "Type" },
    { key: "status", title: "Status" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold">Content Management</h1>
      <Card>
        <DataTable columns={columns} data={items} />
      </Card>
    </AdminLayout>
  );
};

export default AdminContent;
