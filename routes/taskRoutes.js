//taskRoutes.js

const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

//  Create Task
router.post("/", async (req, res) => {
  try {
    const { title, description, location, assignee_id, category_id } = req.body;

    // Default status is "Open" (assuming status_id = 1 is "Open")
    const taskData = {
      title,
      description,
      location,
      assignee_id,
      category_id,
      status_id: 1,
    };

    await Task.createTask(taskData);
    res.json({ message: "Task created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

//  Get All Tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.getAllTasks();
    res.json({ list: tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});
router.get("/:task_id", async (req, res) => {
  try {
    const { task_id } = req.params;
    const task = await Task.getTaskById(task_id);
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// 🔹 Update Task Status
router.put("/:task_id/status", async (req, res) => {
  try {
    const { task_id } = req.params;
    const { status_id } = req.body;

    await Task.updateTaskStatus(task_id, status_id);
    res.json({ message: "Task status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task status" });
  }
});
// 🔹 Update Task
router.put("/:task_id", async (req, res) => {
  try {
    const { task_id } = req.params;
    const { title, description, location, assignee_id, category_id } = req.body;
    const taskData = {
      title,
      description,
      location,
      assignee_id,
      category_id,
    };
    await Task.updateTask(task_id, taskData);
    res.json({ message: "Task updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});
router.delete("/:task_id", async (req, res) => {
  try {
    const { task_id } = req.params;

    await Task.deleteTask(task_id);

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete task" });
  }
});
// In routes

router.post("/update-priority", async (req, res) => {
  try {
    const { tasks } = req.body; // [{ task_id, priority }]

    await Task.updateTaskPriorities(tasks);

    res.json({ message: "Priority updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task priorities" });
  }
});
router.put("/reorder", async (req, res) => {
  const trx = await knex.transaction();
  try {
    const updates = req.body; // [{ task_id: 1, priority: 1 }, ...]
    for (const item of updates) {
      await knex("tasks")
        .where("task_id", item.task_id)
        .update({ priority: item.priority })
        .transacting(trx);
    }
    await trx.commit();
    res.json({ message: "Priority updated" });
  } catch (err) {
    await trx.rollback();
    res.status(500).json({ error: "Failed to reorder tasks" });
  }
});

module.exports = router;
