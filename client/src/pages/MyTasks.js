import React, { useEffect, useState } from "react";
import api from "../services/api";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [reload, setReload] = useState(false);
  const [error, setError] = useState("");

  const fetchMyTasks = async () => {
    try {
      const res = await api.get("/tasks/my-tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch your tasks:", err);
      setError("Failed to load your tasks.");
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, [reload]);

  const refreshTasks = () => setReload((prev) => !prev);

  const handleMarkComplete = async (taskId) => {
    try {
      await api.put(`/tasks/tasks/${taskId}`, { status: "COMPLETED" });
      refreshTasks();
    } catch (err) {
      console.error("Failed to mark task as complete:", err);
      alert("Failed to update task status.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">🗒️ My Tasks</h2>

      {error && <p className="text-red-600 font-semibold mb-4">{error}</p>}
      {!error && tasks.length === 0 && (
        <p className="text-gray-600">No tasks assigned to you yet.</p>
      )}

      {tasks.length > 0 && (
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {task.title}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{task.description}</td>
                  <td className="px-4 py-2">
                    {task.status === "COMPLETED" ? (
                      <span className="text-green-600 font-semibold">✔ Completed</span>
                    ) : (
                      <span className="text-yellow-600 font-medium">⏳ In Progress</span>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {task.status !== "COMPLETED" ? (
                      <button
                        onClick={() => handleMarkComplete(task.id)}
                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                      >
                        Mark as Complete
                      </button>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
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

export default MyTasks;