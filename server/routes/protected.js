const express = require("express");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

const verifyToken = require("../middlewares/verifyToken");
const requireRole = require("../middlewares/requireRole");

/**
 * GET /admin-only
 * Admin-only route — accessible only to users with the "ADMIN" role
 */
router.get("/admin-only", verifyToken, requireRole("ADMIN"), (req, res) => {
  res.json({ message: "This is an admin-only route." });
});

/**
 * GET /manager-dashboard
 * Shared route for users with either "MANAGER" or "ADMIN" roles
 */
router.get("/manager-dashboard", verifyToken, requireRole("MANAGER", "ADMIN"), (req, res) => {
  console.log("Authenticated user:", req.user);
  res.json({ message: "Accessible by MANAGER and ADMIN roles." });
});

/**
 * GET /profile
 * Authenticated route — accessible by any logged-in user
 */
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        email: true,
        role: true,
        lastLogin: true,
        previousLogin: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found." });

    res.status(200).json({ user });
  } catch (err) {
    console.error("Profile route error:", err);
    res.status(500).json({ message: "Server error while fetching profile." });
  }
});

/**
 * GET /audit-logs
 * Admin-only route to view audit logs
 */
router.get("/audit-logs", verifyToken, requireRole("ADMIN"), async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      include: {
        user: { select: { email: true } },
      },
    });

    res.status(200).json({ logs });
  } catch (err) {
    console.error("Error fetching audit logs:", err);
    res.status(500).json({ message: "Failed to fetch audit logs." });
  }
});

module.exports = router;