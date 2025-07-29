import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuditLogs from "./pages/AuditLogs";
import TaskList from "./components/TaskList";
import MyTasks from "./pages/MyTasks";
import TaskForm from "./components/TaskForm";
import EmployeeCreateTask from "./pages/EmployeeCreateTask";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Authenticated Routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AuditLogs />
            </ProtectedRoute>
          }
        />

        {/* Manager/Admin Task Management */}
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks/new"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <TaskForm />
            </ProtectedRoute>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <MyTasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/create-task"
          element={
            <ProtectedRoute allowedRoles={["EMPLOYEE"]}>
              <EmployeeCreateTask />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;