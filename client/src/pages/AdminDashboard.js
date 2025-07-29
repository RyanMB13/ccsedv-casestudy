import React, { useEffect, useState } from "react";
import api from "../services/api";
import EditUserModal from "../components/EditUserModal";
import CreateUserForm from "../components/CreateUserForm";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data.users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Access denied or failed to load users.");
      }
    };

    fetchAllUsers();
  }, []);

  const handleSave = (updatedUser) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === updatedUser.id ? updatedUser : u))
    );
    setEditingUser(null);
  };

  const handleCreate = (newUser) => {
    setUsers((prev) => [...prev, newUser]);
    setShowCreateModal(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">👤 Admin Dashboard</h2>

      <div className="mb-4 flex justify-start">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          + Create User
        </button>
      </div>

      {showCreateModal && (
        <div className="mb-6">
          <CreateUserForm onUserCreated={handleCreate} onCancel={() => setShowCreateModal(false)} />
        </div>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {users.length === 0 && !error && (
        <p className="text-gray-600">No users found.</p>
      )}

      {users.length > 0 && (
        <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Last Login</th>
                <th className="px-4 py-2">Previous Login</th>
                <th className="px-4 py-2">Lockout</th>
                <th className="px-4 py-2">Failed</th>
                <th className="px-4 py-2">Password Changed</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{u.id}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{u.role}</td>
                  <td className="px-4 py-2">
                    {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-2">
                    {u.previousLogin ? new Date(u.previousLogin).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-2">
                    {u.lockoutUntil ? new Date(u.lockoutUntil).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-2">{u.failedLoginAttempts}</td>
                  <td className="px-4 py-2">
                    {u.passwordChangedAt ? new Date(u.passwordChangedAt).toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setEditingUser(u)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

export default AdminDashboard;