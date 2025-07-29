// src/App.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import ChangePassword from "./pages/ChangePassword";
import AuditLogs from "./pages/AuditLogs";
import TaskList from "./components/TaskList";
import MyTasks from "./pages/MyTasks";
import TaskForm from "./components/TaskForm";
import EmployeeCreateTask from "./pages/EmployeeCreateTask";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Navbar />

      {/* Toast container must be placed here to apply globally */}
      <ToastContainer position="top-center" autoClose={3000} />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/request-password-reset" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Authenticated Routes */}
        <Route path="/"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "EMPLOYEE"]}>
              <Home />
            </ProtectedRoute>
          }
        />
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