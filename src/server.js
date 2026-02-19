const app = require("./app");
const config = require("./config");
const connectDB = require("./database/connection");
const fs = require("fs");
const path = require("path");

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), config.upload.dir);
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to database and start server
const startServer = async () => {
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(
      `Server running in ${config.env} mode on port ${config.port}`
    );
  });

  // Handle unhandled rejections
  process.on("unhandledRejection", (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (err) => {
    console.error(`Uncaught Exception: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();
