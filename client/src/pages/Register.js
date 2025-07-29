import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
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
      newErrors.email = "Invalid email format.";
    }

    if (!isReasonablePasswordLength(password)) {
      newErrors.password = "Password must be between 8 and 128 characters.";
    } else if (!isStrongPassword(password)) {
      newErrors.password =
        "Password must include uppercase, lowercase, number, and special character.";
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
        role: "EMPLOYEE",
      });

      toast.success("Registration successful");
      navigate("/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed.";
      setServerError(msg);
      toast.error(msg);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="max-w-sm mx-auto mt-10 p-4 border rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Register</h2>

      {serverError && <p className="text-red-600 mb-2">{serverError}</p>}

      <div className="mb-4">
        <label className="block mb-1">Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <div className="mb-4">
        <label className="block mb-1">Password:</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      <br />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
      >
        Register
      </button>

      <div className="text-center">
        <Link to="/login" className="text-blue-600 hover:underline">
          Already have an account? Login
        </Link>
      </div>
    </form>
  );
}

export default Register;