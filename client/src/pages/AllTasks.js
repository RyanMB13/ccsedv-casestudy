// src/pages/AllTasks.js
import React, { useEffect, useState } from "react";
import api from "../services/api";

function AllTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>All Tasks</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.status} <br />
            Assigned to: {task.assignedTo?.email || "Unassigned"}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllTasks;