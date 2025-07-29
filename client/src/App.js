import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminOnly from "./pages/AdminOnly";
import ManagerDashboard from "./pages/ManagerDashboard";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuditLogs from "./pages/AuditLogs";
import TaskList from "./components/TaskList";
import MyTasks from "./pages/MyTasks";
import TaskForm from "./components/TaskForm";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/NavBar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "CUSTOMER"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-only"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminOnly />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/change-password"
          element={
            <ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "CUSTOMER"]}>
              <ChangePassword />
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

        <Route
          path="/my-tasks"
          element={
            <ProtectedRoute allowedRoles={["CUSTOMER"]}>
              <MyTasks />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;