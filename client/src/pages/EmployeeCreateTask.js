// src/pages/EmployeeCreateTask.js
import { useState } from "react";
import api from "../services/api";

function EmployeeCreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/tasks", {
        title,
        description,
      });

      setTitle("");
      setDescription("");
      setError("");
      alert("Task created successfully.");
    } catch (err) {
      console.error("Error creating self task:", err);
      setError("Failed to create task.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Create My Task</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 border rounded bg-white shadow"
      >
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          required
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Task
        </button>
      </form>
    </div>
  );
}

export default EmployeeCreateTask;