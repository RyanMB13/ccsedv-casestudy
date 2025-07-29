const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const logAudit = require("../utils/logAudit");
const { isValidEmail, isReasonablePasswordLength } = require("../../client/src/utils/validationHelpers");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ===============================
// POST /api/register
// ===============================
exports.registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!isValidEmail(email)) {
      await logAudit({ action: "VALIDATION_FAIL_REGISTER_EMAIL", req });
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!isReasonablePasswordLength(password)) {
      await logAudit({ action: "VALIDATION_FAIL_REGISTER_LENGTH", req });
      return res.status(400).json({ message: "Password length must be between 8 and 64 characters." });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      await logAudit({ action: "REGISTER_EMAIL_EXISTS", req });
      return res.status(400).json({ message: "User already exists." });
    }

    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!complexityRegex.test(password)) {
      await logAudit({ action: "VALIDATION_FAIL_REGISTER_COMPLEXITY", req });
      return res.status(400).json({
        message: "Password must include uppercase, lowercase, number, and special character.",
      });
    }

    // Enforce default role
    const role = "EMPLOYEE";

    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        failedLoginAttempts: 0,
        lockoutUntil: null,
        lastLogin: null,
        previousLogin: null,
      },
    });

    await logAudit({ userId: user.id, action: "REGISTER", req });

    res.status(201).json({
      message: "User registered successfully",
      user: { email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Register error:", err);
    await logAudit({ action: "REGISTER_ERROR", req });
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ===============================
// POST /api/login
// ===============================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!isValidEmail(email)) {
      await logAudit({ action: "VALIDATION_FAIL_LOGIN_EMAIL", req });
      return res.status(400).json({ message: "Invalid email format." });
    }

    if (!isReasonablePasswordLength(password)) {
      await logAudit({ action: "VALIDATION_FAIL_LOGIN_LENGTH", req });
      return res.status(400).json({ message: "Password length must be between 8 and 64 characters." });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await logAudit({ action: "LOGIN_FAILED_NO_USER", req });
      return res.status(401).json({ message: "Invalid email and/or password." });
    }

    if (user.lockoutUntil && new Date() < user.lockoutUntil) {
      await logAudit({ userId: user.id, action: "LOGIN_LOCKED", req });
      return res.status(403).json({ message: "Account is temporarily locked. Please try again later." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          failedLoginAttempts: { increment: 1 },
          lockoutUntil:
            user.failedLoginAttempts + 1 >= 5
              ? new Date(Date.now() + 5 * 60 * 1000)
              : undefined,
        },
      });

      const lockMsg = updatedUser.failedLoginAttempts >= 5 ? " Account locked for 5 minutes." : "";
      await logAudit({ userId: user.id, action: "LOGIN_FAILED_PASSWORD", req });
      return res.status(401).json({ message: "Invalid email and/or password." + lockMsg });
    }

    const now = new Date();
    await prisma.user.update({
      where: { email },
      data: {
        failedLoginAttempts: 0,
        lockoutUntil: null,
        previousLogin: user.lastLogin,
        lastLogin: now,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    await logAudit({ userId: user.id, action: "LOGIN_SUCCESS", req });

    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      previousLogin: user.lastLogin || null,
    });
  } catch (err) {
    console.error("Login error:", err);
    await logAudit({ action: "LOGIN_ERROR", req });
    res.status(500).json({ message: "Server error during login" });
  }
};

// ===============================
// POST /api/change-password
// ===============================
exports.changePassword = async (req, res) => {
  const userId = req.user?.userId;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      await logAudit({ userId, action: "CHANGE_PASSWORD_USER_NOT_FOUND", req });
      return res.status(404).json({ message: "User not found." });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      await logAudit({ userId, action: "CHANGE_PASSWORD_INVALID_CURRENT", req });
      return res.status(400).json({ message: "Current password is incorrect." });
    }

    // Length & complexity check
    if (!isReasonablePasswordLength(newPassword)) {
      await logAudit({ userId, action: "CHANGE_PASSWORD_LENGTH_INVALID", req });
      return res.status(400).json({ message: "Password must be between 8–64 characters." });
    }

    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!complexityRegex.test(newPassword)) {
      await logAudit({ userId, action: "CHANGE_PASSWORD_COMPLEXITY_INVALID", req });
      return res.status(400).json({
        message: "Password must include uppercase, lowercase, number, and special character.",
      });
    }

    // Prevent reusing same password
    const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (isSameAsCurrent) {
      await logAudit({ userId, action: "CHANGE_PASSWORD_REUSE_CURRENT", req });
      return res.status(400).json({ message: "You cannot reuse your current password." });
    }
    
    // Prevent changing password too frequently
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    if (user.passwordChangedAt && user.passwordChangedAt > oneDayAgo) {
      await logAudit({ userId, action: "CHANGE_PASSWORD_TOO_SOON", req });
      return res.status(400).json({
        message: "You can only change your password once every 24 hours.",
      });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Save to history
    await prisma.passwordHistory.create({
      data: {
        userId: user.id,
        hash: hashedNewPassword,
      },
    });

    // Update user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
      },
    });

    await logAudit({ userId, action: "CHANGE_PASSWORD_SUCCESS", req });
    res.json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    await logAudit({ userId, action: "CHANGE_PASSWORD_ERROR", req });
    res.status(500).json({ message: "Server error while changing password." });
  }
};

// ===============================
// POST /api/request-password-reset
// ===============================
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await logAudit({ action: "RESET_REQUEST_NO_USER", req });
      return res.status(200).json({ message: "If that email is registered, a reset link has been sent." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.resetToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt,
      },
    });

    console.log(`🔑 Reset link: http://localhost:3000/reset-password/${token}`);

    await logAudit({ userId: user.id, action: "RESET_REQUEST_SUCCESS", req });
    res.status(200).json({ message: "If that email is registered, a reset link has been sent." });
  } catch (err) {
    console.error("Reset request error:", err);
    await logAudit({ action: "RESET_REQUEST_ERROR", req });
    res.status(500).json({ message: "Error requesting password reset." });
  }
};

// ===============================
// POST /api/reset-password
// ===============================
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const tokenRecord = await prisma.resetToken.findFirst({
      where: {
        token: hashedToken,
        expiresAt: { gt: new Date() },
      },
    });

    if (!tokenRecord) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const user = await prisma.user.findUnique({ where: { id: tokenRecord.userId } });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (!isReasonablePasswordLength(newPassword)) {
      return res.status(400).json({ message: "Password must be 8–64 characters." });
    }

    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!complexityRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must include uppercase, lowercase, number, and special character.",
      });
    }

    const reused = await prisma.passwordHistory.findMany({
      where: { userId: user.id },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    for (const past of reused) {
      if (await bcrypt.compare(newPassword, past.hash)) {
        return res.status(400).json({ message: "You cannot reuse a recent password." });
      }
    }

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    if (user.passwordChangedAt && user.passwordChangedAt > oneDayAgo) {
      return res.status(400).json({ message: "Password was recently changed. Try again after 24 hours." });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        passwordChangedAt: new Date(),
      },
    });

    await prisma.passwordHistory.create({
      data: { userId: user.id, hash: hashed },
    });

    await prisma.resetToken.deleteMany({ where: { userId: user.id } });

    await logAudit({ userId: user.id, action: "RESET_PASSWORD_SUCCESS", req });
    res.json({ message: "Password reset successful." });
  } catch (err) {
    console.error("Reset password error:", err);
    await logAudit({ action: "RESET_PASSWORD_ERROR", req });
    res.status(500).json({ message: "Server error during password reset." });
  }
};