// components/CreateUserForm.js
import React, { useState } from "react";
import api from "../services/api";

function CreateUserForm({ onUserCreated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("MANAGER");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/admin/create-user", { email, password, role });
      onUserCreated(res.data.user);
      setMessage("User created successfully.");
      setEmail("");
      setPassword("");
      setRole("MANAGER");
    } catch (err) {
      console.error("Error creating user:", err);
      setMessage(err.response?.data?.message || "Failed to create user.");
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow max-w-md">
      <h3 className="text-lg font-bold mb-2">Create Admin/Manager User</h3>
      {message && <p className="mb-2 text-blue-700">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Email"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 w-full"
        >
          <option value="MANAGER">MANAGER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create User
        </button>
      </form>
    </div>
  );
}

export default CreateUserForm;