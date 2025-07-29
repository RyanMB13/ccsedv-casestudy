// controllers/taskController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// CREATE task
exports.createTask = async (req, res) => {
  const { title, description, assignedToId } = req.body;
  const creatorId = req.user.userId;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        createdById: creatorId,
        assignedToId: assignedToId || null,
      },
    });
    res.status(201).json(task);
  } catch (err) {
    console.error("Create task error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// GET all tasks (admin/manager)
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      include: {
        createdBy: true,
        assignedTo: true,
      },
    });
    res.json(tasks);
  } catch (err) {
    console.error("Get tasks error:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// GET own assigned tasks (customer)
exports.getMyTasks = async (req, res) => {
  const userId = req.user.userId;

  try {
    const tasks = await prisma.task.findMany({
      where: { assignedToId: userId },
    });
    res.json(tasks);
  } catch (err) {
    console.error("Get my tasks error:", err);
    res.status(500).json({ message: "Failed to fetch your tasks" });
  }
};

// UPDATE task status
exports.updateTask = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await prisma.task.update({
      where: { id: Number(id) },
      data: { status },
    });
    res.json(updated);
  } catch (err) {
    console.error("Update task error:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.task.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (err) {
    console.error("Delete task error:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};