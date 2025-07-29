import { useEffect, useState } from "react";
import api from "../services/api";
import EditTaskModal from "./EditTaskModal";

function TaskList({ reload }) {
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

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

  const confirmDelete = async () => {
    try {
      await api.delete(`/tasks/tasks/${taskToDelete.id}`);
      setTasks((prev) => prev.filter((task) => task.id !== taskToDelete.id));
      setTaskToDelete(null);
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
              <th>Created At</th>
              <th>Updated At</th>
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
                <td>{new Date(task.createdAt).toLocaleString()}</td>
                <td>{new Date(task.updatedAt).toLocaleString()}</td>
                <td className="space-x-1">
                  <button
                    className="bg-green-600 text-white px-2 py-1 rounded"
                    onClick={() => handleMarkComplete(task.id)}
                    disabled={task.status === "COMPLETED"}
                  >
                    Mark as Complete
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                    onClick={() => setEditingTask(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-2 py-1 rounded"
                    onClick={() => setTaskToDelete(task)}
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

      {/* Custom delete confirmation modal */}
      {taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete the task "
              <strong>{taskToDelete.title}</strong>"?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setTaskToDelete(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;