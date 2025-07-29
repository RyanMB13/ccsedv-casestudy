// src/components/Navbar.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", borderBottom: "1px solid #ccc" }}>
      {token ? (
        <>
          <Link to="/profile" style={{ marginRight: "10px" }}>Profile</Link>

          {role === "ADMIN" && (
            <>
              <Link to="/admin-only" style={{ marginRight: "10px" }}>Admin Dashboard</Link>
              <Link to="/audit-logs" style={{ marginRight: "10px" }}>Audit Logs</Link>
            </>
          )}

          {(role === "MANAGER" || role === "ADMIN") && (
            <Link to="/manager-dashboard" style={{ marginRight: "10px" }}>Manager Dashboard</Link>
          )}

          {role === "CUSTOMER" && (
            <Link to="/my-tasks" style={{ marginRight: "10px" }}>My Tasks</Link>
          )}

          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: "10px" }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;