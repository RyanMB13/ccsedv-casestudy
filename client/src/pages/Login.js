// src/pages/Login.js
import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { isValidEmail, isReasonablePasswordLength } from "../utils/validationHelpers";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setValidationError("");

    // Frontend validation
    if (!isValidEmail(email)) {
      setValidationError("Invalid email format.");
      return;
    }

    if (!isReasonablePasswordLength(password)) {
      setValidationError("Password must be between 8 and 100 characters.");
      return;
    }

    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      alert("Login successful");

      const userRole = res.data.role;
      if (userRole === "ADMIN") {
        navigate("/admin-only");
      } else if (userRole === "MANAGER") {
        navigate("/manager-dashboard");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      {validationError && <p style={{ color: "orange" }}>{validationError}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button type="submit">Login</button>
    </form>
  );
}

export default Login;