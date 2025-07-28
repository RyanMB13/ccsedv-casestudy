// src/pages/ResetPassword.js
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { isReasonablePasswordLength } from "../utils/validationHelpers";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");
  const [success, setSuccess] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setValidationError("");

    if (!isReasonablePasswordLength(newPassword)) {
      setValidationError("Password must be between 8 and 128 characters.");
      return;
    }

    try {
      const res = await api.post("/reset-password", { token, newPassword });
      setSuccess(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <form onSubmit={handleReset}>
      <h2>Reset Password</h2>

      {validationError && <p style={{ color: "orange" }}>{validationError}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <label>New Password:</label>
      <input
        type="password"
        required
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <button type="submit">Reset</button>
    </form>
  );
}

export default ResetPassword;