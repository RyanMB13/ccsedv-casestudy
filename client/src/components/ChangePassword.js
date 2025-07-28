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

  const validatePasswordComplexity = (password) => {
    const complexityRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return complexityRegex.test(password);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmNewPassword) {
      return setError("New passwords do not match.");
    }

    if (!validatePasswordComplexity(newPassword)) {
      return setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol."
      );
    }

    try {
      const res = await api.post("/change-password", {
        currentPassword,
        newPassword,
      });

      setSuccess(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");

      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password change failed");
    }
  };

  return (
    <div>
      <h2>Change Password</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleChangePassword}>
        <div>
          <label>Current Password:</label>
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>

        <div>
          <label>New Password:</label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            required
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default ChangePassword;