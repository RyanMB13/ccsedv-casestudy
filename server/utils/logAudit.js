// server/utils/logAudit.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Logs a user action to the AuditLog table.
 *
 * @param {Object} params
 * @param {number|null} params.userId - The ID of the user (null if not authenticated)
 * @param {string} params.action - Description of the action (e.g., LOGIN_SUCCESS)
 * @param {Object} params.req - The request object from Express (used to extract IP and User-Agent)
 */
async function logAudit({ userId = null, action, req }) {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "N/A";
    const userAgent = req.headers["user-agent"] || "N/A";

    await prisma.auditLog.create({
      data: {
        userId,
        action,
        ip,
        userAgent,
      },
    });
  } catch (err) {
    console.error("Failed to log audit event:", err);
  }
}

module.exports = logAudit;