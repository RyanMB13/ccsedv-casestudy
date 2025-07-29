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

// Create a task (Manager/Admin only)
router.post("/tasks", requireRole(["MANAGER", "ADMIN"]), taskController.createTask);

// Get all tasks (Manager/Admin only)
router.get("/tasks", requireRole(["MANAGER", "ADMIN"]), taskController.getAllTasks);

// Get tasks assigned to self (Customer only)
router.get("/my-tasks", requireRole(["CUSTOMER"]), taskController.getMyTasks);

// Update task (Manager/Admin only — extend later if CUSTOMER can update own tasks)
router.put("/tasks/:id", requireRole(["MANAGER", "ADMIN"]), taskController.updateTask);

// Delete task (Manager/Admin only)
router.delete("/tasks/:id", requireRole(["MANAGER", "ADMIN"]), taskController.deleteTask);

module.exports = router;