const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const verifyToken = require("../middlewares/verifyToken");
const requireRole = require("../middlewares/requireRole");
const logAudit = require("../utils/logAudit");

const prisma = new PrismaClient();
const router = express.Router();

// ================================
// GET /audit-logs (ADMIN only)
// ================================
router.get("/audit-logs", verifyToken, requireRole("ADMIN"), async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      include: {
        user: { select: { email: true } },
      },
    });

    res.status(200).json({
      logs: logs.map((log) => ({
        id: log.id,
        timestamp: log.timestamp,
        userEmail: log.user?.email || "N/A",
        action: log.action,
        ip: log.ip,
        userAgent: log.userAgent,
      })),
    });
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ message: "Server error while fetching audit logs." });
  }
});

// ================================
// GET /users (ADMIN only)
// ================================
router.get("/users", verifyToken, requireRole("ADMIN"), async (req, res) => {
  try {
    const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      lastLogin: true,
      previousLogin: true,
      failedLoginAttempts: true,
      lockoutUntil: true,
      passwordChangedAt: true,
  },
});
    await logAudit({
      userId: req.user.userId,
      action: "VIEW_ALL_USERS",
      req,
    });

    res.status(200).json({ users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error while fetching users." });
  }
});

// ================================
// POST /create-user (ADMIN only)
// ================================
const { isValidEmail, isReasonablePasswordLength } = require("../utils/validationHelpers");

router.post("/create-user", verifyToken, requireRole("ADMIN"), async (req, res) => {
  const { email, password, role } = req.body;

  // Basic presence check
  if (!email || !password || !["ADMIN", "MANAGER"].includes(role)) {
    return res.status(400).json({ message: "Invalid input." });
  }

  // Email format validation
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email format." });
  }

  // Password length validation (e.g. 8–64 characters)
  if (!isReasonablePasswordLength(password)) {
    return res.status(400).json({ message: "Password must be 8–64 characters long." });
  }

  // Password complexity validation
  const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!complexityRegex.test(password)) {
    return res.status(400).json({
      message: "Password must include uppercase, lowercase, number, and special character.",
    });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
      },
    });

    await logAudit({
      userId: req.user.userId,
      action: "ADMIN_CREATE_USER",
      req,
      metadata: { createdUserId: user.id, role },
    });

    res.status(201).json({
      message: "User created",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Failed to create user." });
  }
});

// ================================
// PATCH /update-role/:userId (ADMIN only)
// ================================
router.patch("/update-role/:userId", verifyToken, requireRole("ADMIN"), async (req, res) => {
  const { userId } = req.params;
  const { newRole } = req.body;

  if (!["ADMIN", "MANAGER", "EMPLOYEE"].includes(newRole)) {
    return res.status(400).json({ message: "Invalid role specified" });
  }

  try {
    const user = await prisma.user.update({
      where: { id: Number(userId) },
      data: { role: newRole },
    });

    await logAudit({
      userId: req.user.userId,
      action: "UPDATE_ROLE",
      req,
      metadata: { updatedUserId: user.id, newRole },
    });

    res.status(200).json({ message: "User role updated", user });
  } catch (err) {
    console.error("Update role error:", err);
    res.status(500).json({ message: "Failed to update user role" });
  }
});

module.exports = router;