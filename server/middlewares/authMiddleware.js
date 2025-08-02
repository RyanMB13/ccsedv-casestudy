// middlewares/authMiddleware.js

//2.1.1
// Ensure user is authenticated (assumes verifyToken already ran)
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized: No token or user not decoded." });
  }
  next();
}

// Restrict access to specific roles (e.g., ADMIN, MANAGER)
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Insufficient permissions." });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };