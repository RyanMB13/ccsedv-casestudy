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
      await api.put(`/tasks/${taskId}`, { status: "COMPLETED" });
      refreshTasks(); // Refresh list after update
    } catch (err) {
      console.error("Failed to mark task as complete:", err);
      alert("Failed to update task status.");
    }
  };

  return (
    <div>
      <h2>My Tasks</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!error && tasks.length === 0 && <p>No tasks assigned to you yet.</p>}
      {tasks.length > 0 && (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>
                  {task.status !== "COMPLETED" ? (
                    <button onClick={() => handleMarkComplete(task.id)}>
                      Mark as Complete
                    </button>
                  ) : (
                    "✔ Done"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyTasks;