// src/components/TaskList.js
import { useEffect, useState } from "react";
import api from "../services/api";
import EditTaskModal from "./EditTaskModal";

function TaskList({ reload }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await api.get("/tasks/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    }

    fetchTasks();
  }, [reload]);

  const handleMarkComplete = async (id) => {
    try {
      await api.put(`/tasks/tasks/${id}`, { status: "COMPLETED" });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, status: "COMPLETED" } : task
        )
      );
    } catch (err) {
      console.error("Failed to mark task as complete:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await api.delete(`/tasks/tasks/${id}`);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleSaveEdit = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  return (
    <div className="mt-4 p-4">
      <h3 className="text-xl font-semibold mb-4">All Tasks</h3>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table border="1" cellPadding="6" className="bg-white shadow w-full">
          <thead className="bg-gray-100">
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Created By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.id}</td>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>{task.status}</td>
                <td>{task.assignedTo?.email || "Unassigned"}</td>
                <td>{task.createdBy?.email || "Unknown"}</td>
                <td className="space-x-1">
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => handleMarkComplete(task.id)}
                    disabled={task.status === "COMPLETED"}
                  >
                    Mark as Complete
                  </button>
                  <space> </space>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => setEditingTask(task)}
                  >
                    Edit
                  </button>
                  <space> </space>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}

export default TaskList;