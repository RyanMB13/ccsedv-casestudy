// src/pages/EmployeeCreateTask.js
import { useState } from "react";
import api from "../services/api";

function EmployeeCreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await api.post("/tasks/tasks", {
        title,
        description,
      });

      setTitle("");
      setDescription("");
      setSuccess("Task created successfully.");
    } catch (err) {
      console.error("Error creating self task:", err);
      setError("Failed to create task.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">➕ Create Task</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 border border-gray-200 rounded-lg bg-white shadow-md"
      >
        {error && <p className="text-red-600 font-medium">{error}</p>}
        {success && <p className="text-green-600 font-medium">{success}</p>}

        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
            className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the task..."
            required
            className="w-full border p-2 rounded resize-y min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Create Task
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeCreateTask;