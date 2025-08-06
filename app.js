const express = require("express");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
require("./routes/notifications"); // <== Add this line

const fcmRoutes = require("./routes/fcmRoutes");

const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const taskRoutes = require("./routes/taskRoutes");
const pressRelease = require("./routes/pressReleaseRoutes");
const subCategory = require("./routes/subCategoryRoutes");
const birthdayRoutes = require("./routes/birthdayRoutes");
const specialdays = require("./routes/importantDaysRoutes");
const eventRoutes = require("./routes/eventRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const commentRoutes = require("./routes/commentRoutes");
const pressImageRoutes = require("./routes/pressImageRoutes");
const { verifyToken } = require("./middlewares/authMiddleware");
const app = express();
app.use(helmet());
app.use(
  cors({
    origin: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    credentials: true,
    maxAge: 600, // 10mins
    exposedHeaders: "Location",
  })
);

app.use(express.json());
app.use("/api/fcm", fcmRoutes);

app.use("/api/auth", authRoutes);
app.use("/api/roles", verifyToken, roleRoutes);
app.use("/api/permissions", verifyToken, permissionRoutes);
app.use("/api/categories", verifyToken, categoryRoutes);
app.use("/api/tasks", verifyToken, taskRoutes);
app.use("/api/press-release", verifyToken, pressRelease);
app.use("/api/sub-category", verifyToken, subCategory);
app.use("/api/birthdays", verifyToken, birthdayRoutes);
app.use("/api/specialdays", verifyToken, specialdays);
app.use("/api/media", verifyToken, mediaRoutes);
app.use("/api/events", verifyToken, eventRoutes);
app.use("/api/comments", verifyToken, commentRoutes);
app.use("/api/press-media", verifyToken, pressImageRoutes);
// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: "Something went wrong" });
  next();
});

module.exports = app;
