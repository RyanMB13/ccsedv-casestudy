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
 * POST /change-password
 * Allows authenticated users to change their password
 */
router.post("/change-password", verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.userId;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      return res.status(400).json({
        message: "New password must be different from the current password.",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters long.",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, await bcrypt.genSalt(10));

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Server error while changing password." });
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