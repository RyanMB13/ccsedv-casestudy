// src/pages/ManagerDashboard.js
import { useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function ManagerDashboard() {
  const [reload, setReload] = useState(false);

  const refreshTasks = () => setReload((prev) => !prev);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="">
        <h2 className="text-3xl font-bold mb-6">📋 Manager Dashboard</h2>

        <div className="bg-white rounded shadow p-4 mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">➕ Create New Task</h3>
          <TaskForm onTaskCreated={refreshTasks} />
        </div>

        <div className="bg-white rounded shadow p-4">
          <h3 className="text-xl font-semibold mb-3 text-gray-700">📌 Assigned Tasks</h3>
          <TaskList reload={reload} />
        </div>
      </div>
    </div>
  );
}

export default ManagerDashboard;