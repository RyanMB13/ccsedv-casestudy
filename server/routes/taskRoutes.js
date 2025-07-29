// routes/taskRoutes.js
const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const verifyToken = require("../middlewares/verifyToken");

// Middleware: Auth required
router.use(verifyToken);

// Role-based access (optional: you can implement more granular role checks if needed)
const allowRoles = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: "Forbidden: insufficient privileges" });
  }
  next();
};

// Create a task (Manager/Admin only)
router.post("/tasks", allowRoles(["MANAGER", "ADMIN"]), taskController.createTask);

// Get all tasks (Manager/Admin)
router.get("/tasks", allowRoles(["MANAGER", "ADMIN"]), taskController.getAllTasks);

// Get tasks assigned to self (Customer/Employee)
router.get("/my-tasks", allowRoles(["CUSTOMER"]), taskController.getMyTasks);

// Update task (Manager/Admin can update any; Customer can update own if you want to allow)
router.put("/tasks/:id", allowRoles(["MANAGER", "ADMIN"]), taskController.updateTask);

// Delete task (Manager/Admin only)
router.delete("/tasks/:id", allowRoles(["MANAGER", "ADMIN"]), taskController.deleteTask);

module.exports = router;