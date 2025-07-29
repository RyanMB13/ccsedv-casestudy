const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const logAudit = require("../utils/logAudit"); // Make sure this path is correct

const prisma = new PrismaClient();

exports.createUserWithRole = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Email, password, and role are required." });
  }

  if (!["ADMIN", "MANAGER"].includes(role)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(409).json({ message: "User already exists." });

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashed, role },
  });

  await logAudit({
    userId: req.user.userId,
    action: "CREATE_USER_WITH_ROLE",
    req,
    metadata: {
      newUserId: user.id,
      newUserEmail: email,
      newUserRole: role,
    },
  });

  res.status(201).json({ message: "User created", userId: user.id });
};

exports.updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { newRole } = req.body;

  if (!["ADMIN", "MANAGER"].includes(newRole)) {
    return res.status(400).json({ message: "Invalid role." });
  }

  const updated = await prisma.user.update({
    where: { id: Number(id) },
    data: { role: newRole },
  });

  await logAudit({
    userId: req.user.userId,
    action: "UPDATE_USER_ROLE",
    req,
    metadata: {
      updatedUserId: updated.id,
      updatedUserEmail: updated.email,
      newRole,
    },
  });

  res.json({ message: "Role updated", user: updated });
};