import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import DataTable from "../../components/ui/DataTable";
import api from "../../services/api";

const AdminTransactions = () => {
  const [txs, setTxs] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/transactions", {
          params: { page: 1, limit: 50 },
        });
        setTxs(res.data.transactions || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  const columns = [
    { key: "txId", title: "Transaction ID", render: (r) => r._id || r.txId },
    { key: "user", title: "User", render: (r) => r.user?.email || r.userEmail },
    { key: "amount", title: "Amount", render: (r) => r.amount },
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
        <h1 className="text-2xl font-bold">Transactions</h1>

        <Card>
          <DataTable columns={columns} data={txs} />
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
