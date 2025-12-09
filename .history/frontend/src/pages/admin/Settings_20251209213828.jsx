import React, { useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Card from "../../components/ui/Card";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      // optionally refetch
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Settings</h1>

        <Card>
          <div className="grid grid-cols-1 gap-4 max-w-md">
            <label className="text-sm">First name</label>
            <input
              className="border p-2 rounded"
              value={form.firstName}
              onChange={(e) =>
                setForm((s) => ({ ...s, firstName: e.target.value }))
              }
            />

            <label className="text-sm">Last name</label>
            <input
              className="border p-2 rounded"
              value={form.lastName}
              onChange={(e) =>
                setForm((s) => ({ ...s, lastName: e.target.value }))
              }
            />

            <div className="mt-4">
              <button
                onClick={save}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default Settings;
