// server/routes/adminRoutes.js
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const verifyToken = require("../middlewares/verifyToken");
const requireRole = require("../middlewares/requireRole");

const prisma = new PrismaClient();
const router = express.Router();

/**
 * GET /audit-logs
 * Accessible only to ADMIN users
 */
router.get("/audit-logs", verifyToken, requireRole("ADMIN"), async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { timestamp: "desc" },
      include: {
        user: {
          select: {
            email: true,
          },
        },
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

module.exports = router;