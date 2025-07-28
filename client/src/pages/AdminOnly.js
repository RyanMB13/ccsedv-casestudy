import React, { useEffect, useState } from "react";
import api from "../services/api";

function AdminOnly() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await api.get("/profile");
        setUser(res.data.user); // expects { email, role }
      } catch (err) {
        setError("Access denied. Please login as an admin.");
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div>
      <h2>Admin Page</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {user && (
        <>
          <p>Welcome, {user.email}!</p>
          <p>Your role is: {user.role}</p>
        </>
      )}
    </div>
  );
}

export default AdminOnly;