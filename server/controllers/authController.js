const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const logAudit = require("../utils/logAudit");
const { isValidEmail, isReasonablePasswordLength } = require("../utils/validationHelpers");

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// ===============================
// POST /api/register
// ===============================
exports.registerUser = async (req, res) => {
  const { email, password, role } = req.body;

  // Input validation
  if (!isValidEmail(email) || !isReasonablePasswordLength(password)) {
    await logAudit({ action: "VALIDATION_FAILURE_REGISTER", req });
    return res.status(400).json({ message: "Invalid email or password format." });
  }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!complexityRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
    }

    const allowedRoles = ["ADMIN", "MANAGER", "CUSTOMER"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

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
    res.status(500).json({ message: "Server error during registration" });
  }
};

// ===============================
// POST /api/login
// ===============================
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email) || !isReasonablePasswordLength(password)) {
    await logAudit({ action: "VALIDATION_FAILURE_LOGIN", req });
    return res.status(400).json({ message: "Invalid email or password format." });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      await logAudit({ action: "LOGIN_FAILED", req });
      return res.status(401).json({ message: "Invalid email and/or password." });
    }

    if (user.lockoutUntil && new Date() < user.lockoutUntil) {
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
      await logAudit({ userId: user.id, action: "LOGIN_FAILED", req });
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
    res.status(500).json({ message: "Server error during login" });
  }
};