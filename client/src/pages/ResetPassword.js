// pages/ResetPassword.js
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function ResetPassword() {
  const { token } = useParams();
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
      return setError("Passwords do not match.");
    }

    if (!validatePasswordComplexity(newPassword)) {
      return setError(
        "Password must include uppercase, lowercase, number, and special character."
      );
    }

    try {
      const res = await api.post("/auth/reset-password", {
        token,
        newPassword,
      });
      setSuccess(res.data.message);
      setNewPassword("");
      setConfirmNewPassword("");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Password reset failed.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label>New Password: </label>
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="border w-full p-2"
          />
        </div>

        <div>
          <label>Confirm New Password: </label>
          <input
            type="password"
            required
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="border w-full p-2"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;