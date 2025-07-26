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
  return await knex("tasks")
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
const updateTaskStatus = async (taskId, newStatusId, userId = null) => {
  const task = await knex("tasks").where("task_id", taskId).first();
  if (!task) throw new Error("Task not found");

  const previousStatusId = task.status_id;

  await knex("tasks")
    .where("task_id", taskId)
    .update({ status_id: newStatusId, updated_by: userId });

  await knex("task_status_tracker").insert({
    task_id: taskId,
    old_status_id: previousStatusId,
    new_status_id: newStatusId,
    changed_by: userId,
    changed_at: knex.fn.now(),
  });

  return { message: "Status updated and history recorded" };
};
const getTaskStatusFlow = async (task_id) => {
  const statusFlow = await knex("task_status_tracker as t")
    .join("task_status as old", "t.old_status_id", "old.status_id")
    .join("task_status as new", "t.new_status_id", "new.status_id")
    .join("users as u", "t.changed_by", "u.id")
    .select(
      "t.changed_at",
      "old.status_name as from_status",
      "new.status_name as to_status",
      "u.name as changed_by"
    )
    .where("t.task_id", task_id)
    .orderBy("t.changed_at", "asc");

  const flow = [];
  if (statusFlow.length > 0) {
    flow.push({
      name: statusFlow[0].from_status,
      changed_at: null,
      changed_by: null,
    });
    for (const row of statusFlow) {
      flow.push({
        name: row.to_status,
        changed_at: row.changed_at,
        changed_by: row.changed_by,
      });
    }
  }

  return flow;
};

module.exports = {
  createTask,
  getAllTasks,
  updateTaskStatus,
  deleteTask,
  updateTaskPriorities,
  updateTask,
  getTaskById,
  getAllStatuses,
  getTaskStatusFlow,
};
