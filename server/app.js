// server/app.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const adminRoutes = require("./routes/adminRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5050;

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Route Definitions
app.use("/api/auth", authRoutes);           // Login, register, forgot/reset password
app.use("/api", protectedRoutes);           // Profile, shared protected routes
app.use("/api/admin", adminRoutes);         // Admin-only: audit logs, user management
app.use("/api/tasks", taskRoutes);          // Task operations (create, get, update, delete)
app.use("/api/users", userRoutes);          // Public or shared user operations (optional)

// Root endpoint
app.get("/", (req, res) => {
  res.send("Secure Web App Backend");
});

// Server start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});