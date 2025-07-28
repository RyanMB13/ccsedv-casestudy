// src/pages/AuditLogs.js
import React, { useEffect, useState } from "react";
import api from "../services/api";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await api.get("/audit-logs");
        setLogs(res.data.logs);
      } catch (err) {
        setError("Failed to fetch audit logs.");
      }
    };

    fetchLogs();
  }, []);

  return (
    <div>
      <h2>Audit Logs</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && logs.length === 0 && <p>No audit logs available.</p>}
      {logs.length > 0 && (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>IP</th>
              <th>User Agent</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.user?.email || "Unknown"}</td>
                <td>{log.action}</td>
                <td>{log.ip || "N/A"}</td>
                <td>{log.userAgent || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AuditLogs;