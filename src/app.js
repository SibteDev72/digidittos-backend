const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const path = require("path");

const config = require("./config");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./modules/auth/auth.routes");
const usersRoutes = require("./modules/users/users.routes");
const settingsRoutes = require("./modules/settings/settings.routes");
const blogsRoutes = require("./modules/blogs/blogs.routes");
const teamsRoutes = require("./modules/teams/teams.routes");
const caseStudiesRoutes = require("./modules/case-studies/caseStudies.routes");

const app = express();

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: "Too many requests, please try again later" },
});
app.use("/api/", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Compression
app.use(compression());

// Logging
if (config.env === "development") {
  app.use(morgan("dev"));
}

// Static files (uploads)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/settings", settingsRoutes);
app.use("/api/v1/blogs", blogsRoutes);
app.use("/api/v1/teams", teamsRoutes);
app.use("/api/v1/case-studies", caseStudiesRoutes);

// Health check
app.get("/api/v1/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Error handling
app.use(errorHandler);

module.exports = app;
