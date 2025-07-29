import React, { useEffect, useState } from "react";
import api from "../services/api";

function AdminDashboard() {
  const [users, setUsers] = useState([]); 
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await api.get("/admin/users"); // Ensure backend is correct
        setUsers(res.data.users); // Make sure this is an array
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Access denied or failed to load users.");
      }
    };

    fetchAllUsers();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin: All Users</h2>
      {error && <p className="text-red-600">{error}</p>}

      {users.length === 0 && !error && <p>No users found.</p>}

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
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "N/A"}</td>
                <td>{u.previousLogin ? new Date(u.previousLogin).toLocaleString() : "N/A"}</td>
                <td>{u.lockoutUntil ? new Date(u.lockoutUntil).toLocaleString() : "N/A"}</td>
                <td>{u.failedLoginAttempts}</td>
                <td>{u.passwordChangedAt ? new Date(u.passwordChangedAt).toLocaleString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;