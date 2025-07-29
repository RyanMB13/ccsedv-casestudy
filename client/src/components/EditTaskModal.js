import { useState, useEffect } from "react";
import api from "../services/api";

function EditTaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [status, setStatus] = useState(task?.status || "PENDING");

  useEffect(() => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setStatus(task?.status || "PENDING");
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(`/tasks/tasks/${task.id}`, {
        title,
        description,
        status,
      });
      onSave(res.data);
      onClose();
    } catch (err) {
      console.error("Failed to update task:", err);
      alert("Update failed.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-md">
        <h3 className="text-xl font-bold mb-4">✏️ Edit Task</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-semibold">Title: </label>
            <input
              className="w-full border px-2 py-1 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold">Description: </label>
            <textarea
              className="w-full border px-2 py-1 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold">Status: </label>
            <select
              className="w-full border px-2 py-1 rounded"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-semibold text-gray-600">Assigned To: </label>
            <input
              className="w-full border px-2 py-1 rounded bg-gray-100 text-sm"
              value={task?.assignedTo?.email || "Unassigned"}
              disabled
              readOnly
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-600">Created By: </label>
            <input
              className="w-full border px-2 py-1 rounded bg-gray-100 text-sm"
              value={task?.createdBy?.email || "Unknown"}
              disabled
              readOnly
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;