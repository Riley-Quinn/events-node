//Task.js ---> model

const knex = require("../db");

const createTask = async (taskData) => {
  const maxPriority = await knex("tasks").max("priority as max").first();
  taskData.priority = (maxPriority.max || 0) + 1;
  return knex("tasks").insert(taskData);
};

const getAllTasks = async () => {
  return knex("tasks")
    .select(
      "tasks.task_id",
      "tasks.title",
      "tasks.description",
      "tasks.location",
      "tasks.assignee_id",
      "users.name as assignee_name",
      "tasks.category_id",
      "categories.name as category_name",
      "tasks.sub_category_id",
      "sub_categories.name as sub_category_name",
      "tasks.status_id",
      "task_status.status_name",
      "tasks.priority",
      "tasks.created_at",
      "tasks.updated_at",
      "tasks.estimated_date",
      "tasks.is_important"
    )
    .leftJoin("users", "tasks.assignee_id", "users.id")
    .leftJoin("categories", "tasks.category_id", "categories.category_id")
    .leftJoin(
      "sub_categories",
      "tasks.sub_category_id",
      "sub_categories.sub_category_id"
    )
    .leftJoin("task_status", "tasks.status_id", "task_status.status_id")
    .orderBy("tasks.priority", "asc");
};
const getTaskById = async (taskId) => {
  return knex("tasks")
    .select(
      "tasks.task_id",
      "tasks.title",
      "tasks.description",
      "tasks.location",
      "tasks.assignee_id",
      "users.name as assignee_name",
      "tasks.category_id",
      "categories.name as category_name",
      "tasks.sub_category_id",
      "sub_categories.name as sub_category_name",
      "tasks.status_id",
      "task_status.status_name",
      "tasks.priority",
      "tasks.created_at",
      "tasks.updated_at",
      "tasks.estimated_date",
      "tasks.is_important"
    )
    .leftJoin("users", "tasks.assignee_id", "users.id")
    .leftJoin("categories", "tasks.category_id", "categories.category_id")
    .leftJoin(
      "sub_categories",
      "tasks.sub_category_id",
      "sub_categories.sub_category_id"
    )
    .leftJoin("task_status", "tasks.status_id", "task_status.status_id")
    .where("tasks.task_id", taskId)
    .first();
};
const getAllStatuses = async (type = "all") => {
  const query = knex("task_status").select("*").orderBy("status_id");
  if (type !== "all") {
    query.where("status_type", type);
  }
  return query;
};
const updateTaskStatus = async (taskId, status_id) => {
  return knex("tasks")
    .where({ task_id: taskId })
    .update({ status_id, updated_at: knex.fn.now() });
};
const updateTask = async (taskId, taskData) => {
  return knex("tasks")
    .where({ task_id: taskId })
    .update({ ...taskData, updated_at: knex.fn.now() });
};
// Function to delete a task
const deleteTask = async (taskId) => {
  return knex("tasks").where({ task_id: taskId }).del();
};
const updateTaskPriorities = async (tasks) => {
  return knex.transaction(async (trx) => {
    for (const task of tasks) {
      await trx("tasks")
        .where({ task_id: task.task_id })
        .update({ priority: task.priority, updated_at: knex.fn.now() });
    }
  });
};
// In your Express router

module.exports = {
  createTask,
  getAllTasks,
  updateTaskStatus,
  deleteTask,
  updateTaskPriorities,
  updateTask,
  getTaskById,
  getAllStatuses,
};
