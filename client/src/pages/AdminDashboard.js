// AdminDashboard.js
import React, { useEffect, useState } from "react";
import api from "../services/api";
import EditUserModal from "../components/EditUserModal";
import CreateUserForm from "../components/CreateUserForm";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const fetchAllUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      const userList = Array.isArray(res.data.users) ? res.data.users : [];
      setUsers(userList);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Access denied or failed to load users.");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>

      {error && <p className="text-red-600">{error}</p>}

      {users.length === 0 && !error && <p>No users found.</p>}
      <CreateUserForm onUserCreated={fetchAllUsers} />
      <h3>User List</h3>
      {users.length > 0 && (
        <table className="w-full border border-collapse mt-4" border="1" cellPadding="6">
          <thead>
            <tr className="bg-gray-200">
              <th>ID</th>
              <th>Email</th>
              <th>Role</th>
              <th>Last Login</th>
              <th>Previous Login</th>
              <th>Lockout Until</th>
              <th>Failed Attempts</th>
              <th>Password Changed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((u) => u && typeof u.id !== "undefined")
              .map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "N/A"}</td>
                  <td>{u.previousLogin ? new Date(u.previousLogin).toLocaleString() : "N/A"}</td>
                  <td>{u.lockoutUntil ? new Date(u.lockoutUntil).toLocaleString() : "N/A"}</td>
                  <td>{u.failedLoginAttempts}</td>
                  <td>{u.passwordChangedAt ? new Date(u.passwordChangedAt).toLocaleString() : "N/A"}</td>
                  <td>
                    <button
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                      onClick={() => setEditingUser(u)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onRefresh={fetchAllUsers}
        />
      )}
    </div>
  );
}

export default AdminDashboard;