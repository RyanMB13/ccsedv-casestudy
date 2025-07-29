const { PrismaClient } = require("@prisma/client");
const logAudit = require("../utils/logAudit");

const prisma = new PrismaClient();

// ===============================
// CREATE Task
// ===============================
exports.createTask = async (req, res) => {
  const { title, description, assignedToId } = req.body;
  const creatorId = req.user.userId;
  const role = req.user.role;

  try {
    let finalAssignedToId = assignedToId;

    if (role === "EMPLOYEE") {
      finalAssignedToId = creatorId;
    } else {
      if (!assignedToId) {
        return res.status(400).json({
          message: "assignedToId is required for managers/admins.",
        });
      }

      const userExists = await prisma.user.findUnique({
        where: { id: Number(assignedToId) },
      });

      if (!userExists) {
        return res.status(404).json({ message: "Assigned user not found" });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        createdById: creatorId,
        assignedToId: Number(finalAssignedToId),
      },
    });

    await logAudit({
      userId: creatorId,
      action: "CREATE_TASK",
      req,
      metadata: {
        taskId: task.id,
        title: task.title,
        assignedToId: finalAssignedToId,
      },
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// ===============================
// GET All Tasks (Admins/Managers)
// ===============================
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        createdBy: true,
        assignedTo: true,
      },
    });

    await logAudit({
      userId: req.user.userId,
      action: "VIEW_ALL_TASKS",
      req,
    });

    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// ===============================
// GET My Tasks (Employees)
// ===============================
exports.getMyTasks = async (req, res) => {
  const userId = req.user.userId;

  try {
    const tasks = await prisma.task.findMany({
      where: { assignedToId: userId },
    });

    await logAudit({
      userId,
      action: "VIEW_MY_TASKS",
      req,
    });

    res.json(tasks);
  } catch (err) {
    console.error("Get my tasks error:", err);
    res.status(500).json({ message: "Failed to fetch your tasks" });
  }
};

// ===============================
// UPDATE Task Status
// ===============================
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { status, title, description } = req.body;

  try {
    const task = await prisma.task.findUnique({
      where: { id: Number(id) },
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // EMPLOYEES can only update their own assigned tasks
    if (
      req.user.role === "EMPLOYEE" &&
      task.assignedToId !== req.user.userId
    ) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: {
        ...(status && { status }),
        ...(title && { title }),
        ...(description && { description }),
      },
      include: {
        assignedTo: true,
        createdBy: true,
      },
    });

    await logAudit({
      userId: req.user.userId,
      action: "UPDATE_TASK",
      req,
      metadata: {
        taskId: id,
        newStatus: updated.status,
        updatedFields: { title, description },
      },
    });

    res.json(updated);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// ===============================
// DELETE Task
// ===============================
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({ where: { id: Number(id) } });

    await logAudit({
      userId: req.user.userId,
      action: "DELETE_TASK",
      req,
      metadata: { taskId: id },
    });

    res.status(204).send();
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};