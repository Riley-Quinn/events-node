const knex = require("../db");

// Create a new press release
const createPressRelease = async (pressData) => {
  try {
    const [insertedId] = await knex("press_releases").insert(pressData);
    return { press_id: insertedId, ...pressData };
  } catch (err) {
    console.error("Error creating press release:", err);
    throw err;
  }
};

const getAllPressReleases = async () => {
  return knex("press_releases")
    .select(
      "press_releases.press_id",
      "press_releases.title",
      "press_releases.notes",
      "press_releases.assignee_id",
      "users.name as assignee_name",
      "press_releases.status_id",
      "task_status.status_name",
      "press_releases.created_at",
      "press_releases.updated_at"
    )
    .leftJoin("users", "press_releases.assignee_id", "users.id")
    .leftJoin(
      "task_status",
      "press_releases.status_id",
      "task_status.status_id"
    )
    .orderBy("created_at", "desc");
};

// Get a press release by ID
const getPressReleaseById = async (pressId) => {
  try {
    return await knex("press_releases").where({ press_id: pressId }).first();
  } catch (err) {
    console.error("Error fetching press release by ID:", err);
    throw err;
  }
};
const updatePressReleaseStatus = async (pressId, status_id) => {
  return knex("press_releases")
    .where({ press_id: pressId })
    .update({ status_id, updated_at: knex.fn.now() });
};
// Update a press release
const updatePressRelease = async (pressId, pressData) => {
  try {
    return await knex("press_releases")
      .where({ press_id: pressId })
      .update(pressData);
  } catch (err) {
    console.error("Error updating press release:", err);
    throw err;
  }
};

// Delete a press release
const deletePressRelease = async (pressId) => {
  try {
    return await knex("press_releases").where({ press_id: pressId }).del();
  } catch (err) {
    console.error("Error deleting press release:", err);
    throw err;
  }
};

module.exports = {
  createPressRelease,
  getAllPressReleases,
  getPressReleaseById,
  updatePressRelease,
  deletePressRelease,
  updatePressReleaseStatus,
};
