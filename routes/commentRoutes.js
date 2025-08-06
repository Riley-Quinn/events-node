const express = require("express");
const router = express.Router();
const Comments = require("../models/Comments");
const { generateUniqueId } = require("../utils");
const Task = require("../models/Task");
const PressRelease = require("../models/PressRelease");

// Get all Comments
router.get("/:moduleId", async (req, res) => {
  try {
    const { moduleId } = req.params;
    const { module } = req.query;
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }
    if (module === "task") {
      const existingTask = await Task.getTaskById(moduleId);
      if (!existingTask) {
        return res.status(404).json({ error: "Task not found" });
      }
    } else if (module === "press_release") {
      const existingPress = await PressRelease.getPressReleaseById(moduleId);
      if (!existingPress) {
        return res.status(404).json({ error: "Press release not found" });
      }
    }
    const commentsList = await Comments.getAllCommentsByModule(
      module,
      moduleId
    );
    return res.status(200).json({ list: commentsList });
  } catch (error) {
    console.error("Error fetching getAllCommentsByModule", error);
    return res.status(500).json({ error: "Failed to fetch  comments" });
  }
});

// Create Comments
router.post("/", async (req, res) => {
  try {
    const user = req.user;
    const { module, moduleId } = req.query;
    let task_id = null;
    let press_id = null;
    let comments_module = null;
    if (!module) {
      return res.status(404).json({ error: "Module not found" });
    }
    if (module === "task") {
      const existingTask = await Task.getTaskById(moduleId);
      if (!existingTask) {
        return res.status(404).json({ error: "Task not found" });
      }
      comments_module = "task";
      task_id = moduleId;
    } else if (module === "press_release") {
      const existingPress = await PressRelease.getPressReleaseById(moduleId);
      if (!existingPress) {
        return res.status(404).json({ error: "Press release not found" });
      }
      comments_module = "press_release";
      press_id = moduleId;
    }
    const { comment } = req.body;
    let unqId;
    let isUnique = false;

    while (!isUnique) {
      unqId = generateUniqueId();
      const companyData = await Comments.getCommentById(unqId);
      if (!companyData) {
        isUnique = true;
      }
    }
    const payload = {
      comment_id: unqId,
      commented_by: user?.id,
      comment,
    };
    await Comments.addComment({
      ...payload,
      task_id,
      press_id,
      comments_module,
    });
    const savedComment = {
      ...payload,
      created_at: new Date(),
      commented_username: user.name,
      module,
      moduleId,
    };

    const io = req.app.get("io");
    io.to(`${module}-${moduleId}`).emit("new_comment", savedComment);

    return res.status(201).json(savedComment);
  } catch (error) {
    console.error("error", error);
    res.status(500).json({ error: "Failed to create event" });
  }
});

module.exports = router;
