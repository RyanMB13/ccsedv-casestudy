// src/pages/ChangePassword.js
import React, { useState } from "react";
import api from "../services/api";
import { isReasonablePasswordLength } from "../utils/validationHelpers";

function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = async (e) => {
    e.preventDefault();
    setValidationError("");
    setError("");
    setMessage("");

    if (
      !isReasonablePasswordLength(oldPassword) ||
      !isReasonablePasswordLength(newPassword)
    ) {
      setValidationError("Passwords must be between 8 and 128 characters.");
      return;
    }

    try {
      const res = await api.post("/change-password", { oldPassword, newPassword });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    }
  };

  return (
    <form onSubmit={handleChange}>
      <h2>Change Password</h2>

      {validationError && <p style={{ color: "orange" }}>{validationError}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <label>Old Password:</label>
      <input
        type="password"
        required
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />

      <label>New Password:</label>
      <input
        type="password"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button type="submit">Change</button>
    </form>
  );
}

export default ChangePassword;