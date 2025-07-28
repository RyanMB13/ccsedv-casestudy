// src/pages/Register.js
import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  isValidEmail,
  isReasonablePasswordLength,
  isStrongPassword,
} from "../utils/validationHelpers";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!isValidEmail(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!isReasonablePasswordLength(password)) {
      newErrors.password = "Password must be between 8 and 128 characters";
    } else if (!isStrongPassword(password)) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, and special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    try {
      await api.post("/register", { email, password, role });
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>

      {serverError && <p style={{ color: "red" }}>{serverError}</p>}

      <div>
        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
      </div>

      <div>
        <label>Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="ADMIN">Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="CUSTOMER">Customer</option>
        </select>
      </div>

      <button type="submit">Register</button>
    </form>
  );
}

export default Register;