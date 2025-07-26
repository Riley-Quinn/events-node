//taskRoutes.js

const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { generateUniqueId } = require("../utils");
//  Create Task
router.post("/", async (req, res) => {
  try {
    const user = req.user;

    const {
      title,
      description,
      location,
      assignee_id,
      category_id,
      sub_category_id,
      status_id,
      estimated_date,
      is_important,
    } = req.body;
    let unqId;
    let isUnique = false;

    while (!isUnique) {
      unqId = generateUniqueId();
      const taskData = await Task.getTaskById(unqId);
      if (!taskData) {
        isUnique = true;
      }
    }
    // Default status is "Open" (assuming status_id = 1 is "Open")
    const taskData = {
      task_id: unqId,
      title,
      description,
      location,
      assignee_id,
      category_id,
      sub_category_id,
      created_by: user?.id,
      status_id,
      estimated_date,
      is_important: is_important || false,
    };
    await Task.createTask(taskData);
    res.status(201).json({ message: "Task created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create task" });
  }
});

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.getAllTasks();
    res.status(200).json({ list: tasks });
  } catch (err) {
    console.error("Error fetching all tasks", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

//  Get All Tasks status
router.get("/status/all", async (req, res) => {
  try {
    const { type } = req.query; // type can be 'all' or specific status
    const statuses = await Task.getAllStatuses(type);
    res.status(200).json({ list: statuses });
  } catch (err) {
    console.error("Error fetching statuses", err);
    res.status(500).json({ message: "Failed to fetch statuses" });
  }
});
router.get("/:task_id", async (req, res) => {
  try {
    const { task_id } = req.params;
    const taskData = await Task.getTaskById(task_id);
    if (!taskData) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json(taskData);
  } catch (err) {
    console.error("Error fetching getTaskById  ", err);
    res.status(500).json({ error: "Failed to get task" });
  }
});

// ✅ GET All Task Statuses
router.get("/status/all", async (req, res) => {
  try {
    const statuses = await TaskStatus.getAll();
    res.status(200).json(statuses);
  } catch (err) {
    console.error("Failed to fetch task statuses", err);
    res.status(500).json({ error: "Failed to fetch task statuses" });
  }
});

// 🔹 Update Task Status
router.put("/:task_id/status", async (req, res) => {
  try {
    const user = req.user;
    const { task_id } = req.params;
    const { status_id } = req.body;

    await Task.updateTaskStatus(task_id, status_id, user?.id); // Call the new function

    res
      .status(200)
      .json({ message: "Task status updated and history recorded" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message || "Failed to update task status" });
  }
});

// 🔹 Update Task
router.put("/:task_id", async (req, res) => {
  try {
    const user = req.user;
    const { task_id } = req.params;
    const {
      title,
      description,
      location,
      assignee_id,
      category_id,
      sub_category_id,
      estimated_date,
      status_id,
      is_important,
    } = req.body;
    const taskData = {
      title,
      description,
      location,
      assignee_id,
      category_id,
      sub_category_id,
      updated_by: user?.id,
      estimated_date,
      status_id,
      is_important: is_important || false,
    };
    const existingTask = await Task.getTaskById(task_id);
    if (!existingTask) {
      return res.status(400).json({ error: "Task not found" });
    }
    await Task.updateTask(task_id, taskData);
    res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task" });
  }
});
router.delete("/:task_id", async (req, res) => {
  try {
    const { task_id } = req.params;
    const existingTask = await Task.getTaskById(task_id);
    if (!existingTask) {
      return res.status(400).json({ error: "Task not found" });
    }
    await Task.deleteTask(task_id);

    res.status(200).json({ message: "Task deleted successfully" });
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

    res.status(200).json({ message: "Priority updated successfully" });
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
router.get("/:task_id/status-flow", async (req, res) => {
  try {
    const { task_id } = req.params;
    const flow = await Task.getTaskStatusFlow(task_id);
    res.json({ flow });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get status flow" });
  }
});

module.exports = router;
