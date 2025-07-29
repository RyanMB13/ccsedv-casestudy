// pages/ChangePassword.js
import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const validatePasswordComplexity = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmNewPassword) {
      return setError("New passwords do not match.");
    }

    if (!validatePasswordComplexity(newPassword)) {
      return setError(
        "Password must include uppercase, lowercase, number, and special character."
      );
    }

    try {
      const res = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setSuccess(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Change Password</h2>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="border w-full p-2"
          />
        </div>

        <div>
          <label>New Password:</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border w-full p-2"
          />
        </div>

        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            required
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="border w-full p-2"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Change Password
        </button>
      </form>
    </div>
  );
}

export default ChangePassword;