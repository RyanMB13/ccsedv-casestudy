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
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">🧾 Audit Logs</h2>

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!error && logs.length === 0 && <p className="text-gray-600">No audit logs available.</p>}

      {logs.length > 0 && (
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-gray-100 text-left text-gray-700">
              <tr>
                <th className="px-4 py-2">Timestamp</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">IP Address</th>
                <th className="px-4 py-2">User Agent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-2">{log.user?.email || "Unknown"}</td>
                  <td className="px-4 py-2">{log.action}</td>
                  <td className="px-4 py-2">{log.ip || "N/A"}</td>
                  <td className="px-4 py-2 whitespace-nowrap overflow-hidden overflow-ellipsis max-w-xs">
                    {log.userAgent || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AuditLogs;