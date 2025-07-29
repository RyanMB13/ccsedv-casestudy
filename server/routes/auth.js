// routes/auth.js
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  changePassword,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");

const verifyToken = require("../middlewares/verifyToken");

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", verifyToken, changePassword);

// Password reset routes
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;