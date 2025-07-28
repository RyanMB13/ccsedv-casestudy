import React, { useEffect, useState } from "react";
import api from "../services/api";

function ManagerDashboard() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get("/manager-dashboard");
        setMessage(res.data.message);
      } catch (err) {
        setError("Access denied: Managers or Admins only.");
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>Manager Dashboard</h2>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>{message}</p>}
    </div>
  );
}

export default ManagerDashboard;