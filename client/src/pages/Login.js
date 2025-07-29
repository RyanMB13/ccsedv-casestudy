import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { isValidEmail, isReasonablePasswordLength } from "../utils/validationHelpers";
import { toast } from "react-toastify";

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

    if (!isValidEmail(email)) {
      setValidationError("Invalid email format.");
      return;
    }

    if (!isReasonablePasswordLength(password)) {
      setValidationError("Password must be between 8 and 100 characters.");
      return;
    }

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      toast.success("Login successful!");

    
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleLogin} className="max-w-sm mx-auto mt-10 p-4 border rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>

      {validationError && <p className="text-orange-600 mb-2">{validationError}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="mb-4">
        <label className="block mb-1">Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
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
      </div>
      <br></br>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-2"
      >
        Login
      </button>

      <div className="text-center">
        <Link to="/request-password-reset" className="text-blue-600 hover:underline">
          Forgot Password?
        </Link>
      </div>
    </form>
  );
}

export default Login;