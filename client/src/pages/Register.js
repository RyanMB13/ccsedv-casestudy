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
      await api.post("/auth/register", {
        email,
        password,
        role: "EMPLOYEE", // Force default role
      });
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister} className="max-w-md mx-auto p-6 bg-white rounded shadow space-y-4">
      <h2 className="text-2xl font-bold">Register</h2>

      {serverError && <p className="text-red-500">{serverError}</p>}

      <div>
        <label>Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email}</p>}
      </div>

      <div>
        <label>Password:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />
        {errors.password && <p className="text-red-500">{errors.password}</p>}
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Register
      </button>
    </form>
  );
}

export default Register;