// src/pages/MyTasks.js
import React, { useEffect, useState } from "react";
import api from "../services/api";

function MyTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchMyTasks() {
      try {
        const res = await api.get("/my-tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch your tasks:", err);
      }
    }

    fetchMyTasks();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned to you yet.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="border rounded p-3 bg-white shadow">
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyTasks;