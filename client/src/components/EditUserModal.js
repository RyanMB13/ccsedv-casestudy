import React, { useState } from "react";
import api from "../services/api";

function EditUserModal({ user, onClose, onRefresh }) {
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.patch(`/admin/update-role/${user.id}`, {
        newRole: role,
      });
      onRefresh();
      onClose();
    } catch (err) {
      console.error("Failed to update user:", err);
      alert("Failed to update user role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h3 className="text-lg font-semibold mb-4">Edit User</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Email:</label>
            <p className="text-gray-800">{user.email}</p>
          </div>

          <div className="mb-4">
            <label className="block mb-1">Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border px-2 py-1"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="MANAGER">MANAGER</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserModal;