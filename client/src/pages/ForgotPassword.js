import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await api.post("/auth/request-password-reset", { email });
      setMessage(res.data.message);

    } catch (err) {
      const msg = err.response?.data?.message || "Request failed.";
      setMessage(msg);
      toast.error(msg);
    }
  };

  return (
    <form
      onSubmit={handleRequest}
      className="max-w-sm mx-auto mt-10 p-4 border rounded shadow"
    >
      <h2 className="text-xl font-bold mb-4 text-center">Forgot Password</h2>

      {message && (
        <p
          className={`text-sm mb-4 ${
            message.toLowerCase().includes("sent") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mb-4">
        <label className="block mb-1">Email:</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Send Reset Link
      </button>
    </form>
  );
}

export default ForgotPassword;