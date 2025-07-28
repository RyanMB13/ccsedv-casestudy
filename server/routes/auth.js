const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  changePassword,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", changePassword);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);

module.exports = router;