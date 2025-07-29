// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const verifyToken = require("../middlewares/verifyToken");
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");

// Middleware: verify JWT and decode user
router.use(verifyToken);

// Middleware: require user to be authenticated
router.use(requireAuth);

// ==============================
// Create a task (Admin, Manager, or Employee can create)
// - Admins/Managers can assign to others
// - Employees can only assign to themselves
// ==============================
router.post("/tasks", requireRole(["ADMIN", "MANAGER", "EMPLOYEE"]), taskController.createTask);

// Get all tasks (Manager/Admin only)
router.get("/tasks", requireRole(["MANAGER", "ADMIN"]), taskController.getAllTasks);

// Get tasks assigned to self (Employee only)
router.get("/my-tasks", requireRole(["EMPLOYEE"]), taskController.getMyTasks);

// Update task (Manager/Admin only — extend later if Employee can update own tasks)
router.put("/tasks/:id", requireRole(["MANAGER", "ADMIN", "EMPLOYEE"]), taskController.updateTask);

// Delete task (Manager/Admin only)
router.delete("/tasks/:id", requireRole(["MANAGER", "ADMIN"]), taskController.deleteTask);

module.exports = router;