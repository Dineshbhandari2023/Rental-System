import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import useFetch from "../../hooks/useFetch";

const AdminDashboard = () => {
  const { data, loading } = useFetch("/admin/stats", []);
  const stats = data?.stats;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview and quick stats</p>
          </div>
        </div>

        {loading ? (
          <div>Loading stats...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <p className="text-sm text-gray-500">Total Users</p>
              <div className="mt-2 text-2xl font-bold">
                {stats?.totalUsers ?? "-"}
              </div>
            </Card>

            <Card>
              <p className="text-sm text-gray-500">Verified Users</p>
              <div className="mt-2 text-2xl font-bold">
                {stats?.verifiedUsers ?? "-"}
              </div>
            </Card>

            <Card>
              <p className="text-sm text-gray-500">Active Users</p>
              <div className="mt-2 text-2xl font-bold">
                {stats?.activeUsers ?? "-"}
              </div>
            </Card>

            <Card>
              <p className="text-sm text-gray-500">Verification Rate</p>
              <div className="mt-2 text-2xl font-bold">
                {stats?.verificationRate ?? "-"}%
              </div>
            </Card>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="font-semibold">Send Announcement</h3>
            <p className="text-sm text-gray-500 mt-1">
              Broadcast messages to all users.
            </p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-indigo-600 text-white rounded">
                Open
              </button>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold">Generate Report</h3>
            <p className="text-sm text-gray-500 mt-1">
              Export monthly performance.
            </p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-white border rounded">Run</button>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold">System Health</h3>
            <p className="text-sm text-gray-500 mt-1">Quick health checks.</p>
            <div className="mt-4">
              <button className="px-4 py-2 bg-white border rounded">
                Check
              </button>
            </div>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
