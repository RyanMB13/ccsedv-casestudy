// src/pages/ManagerDashboard.js
import { useState } from "react";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

function ManagerDashboard() {
  const [reload, setReload] = useState(false);

  const refreshTasks = () => setReload((prev) => !prev);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manager Dashboard</h2>
      <TaskForm onTaskCreated={refreshTasks} />
      <TaskList reload={reload} />
    </div>
  );
}

export default ManagerDashboard;