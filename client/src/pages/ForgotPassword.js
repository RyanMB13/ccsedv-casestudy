// src/pages/ForgotPassword.js
import React, { useState } from "react";
import api from "../services/api";
import { isValidEmail } from "../utils/validationHelpers";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");
    setError("");

    if (!isValidEmail(email)) {
      setValidationError("Invalid email format.");
      return;
    }

    try {
      const res = await api.post("/request-password-reset", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to request password reset.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password</h2>

      {validationError && <p style={{ color: "orange" }}>{validationError}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <label>Email:</label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button type="submit">Send Reset Link</button>
    </form>
  );
}

export default ForgotPassword;