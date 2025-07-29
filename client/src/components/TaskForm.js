// src/components/TaskForm.js
import { useState, useEffect } from "react";
import api from "../services/api";

function TaskForm({ onTaskCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedToId, setAssignedToId] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await api.get("/users"); // Must be protected by auth
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Could not load users");
      }
    }

    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/tasks", {
        title,
        description,
        assignedToId: assignedToId || null, // null for unassigned
      });

      setTitle("");
      setDescription("");
      setAssignedToId("");
      setError("");
      onTaskCreated(); // Refresh task list
    } catch (err) {
      console.error("Error creating task:", err);
      setError("Failed to create task.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 border rounded bg-white shadow"
    >
      <h3 className="text-lg font-semibold">Create Task</h3>

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

      <select
        value={assignedToId}
        onChange={(e) => setAssignedToId(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">-- Assign to... --</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email} ({user.role})
          </option>
        ))}
      </select>

      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Task
      </button>
    </form>
  );
}

export default TaskForm;