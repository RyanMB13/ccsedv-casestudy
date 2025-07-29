// src/components/TaskList.js
import { useEffect, useState } from "react";
import api from "../services/api";

function TaskList({ reload }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await api.get("/tasks");
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    }

    fetchTasks();
  }, [reload]);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">All Tasks</h3>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="p-3 border rounded bg-gray-50">
              <strong>{task.title}</strong>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <p>Assigned to: {task.assignedTo?.email || "Unassigned"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;