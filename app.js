const express = require("express");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const taskRoutes = require("./routes/taskRoutes");
const pressRelease = require("./routes/pressReleaseRoutes");
const subCategory = require("./routes/subCategoryRoutes");
const app = express();
app.use(helmet());
app.use(
  cors({
    origin: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: "Location",
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/press-release", pressRelease);
app.use("/api/sub-category", subCategory);
// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Something went wrong" });
  next();
});

module.exports = app;
