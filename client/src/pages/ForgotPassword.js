// ForgotPassword.js
import { useState } from "react";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/request-password-reset", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Request failed.");
    }
  };

  return (
    <form onSubmit={handleRequest}>
      <h2>Forgot Password</h2>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />
      <space>   </space>
      <button type="submit">Send Reset Link</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default ForgotPassword;