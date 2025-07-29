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

const app = express();
const PORT = process.env.PORT || 5050;

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// Middleware
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", taskRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.send("Secure Web App Backend");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});