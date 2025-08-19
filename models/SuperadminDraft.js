const knex = require("../db"); // your knex instance

// Create a new draft
const createDraft = async (draftData) => {
  return knex("superadmin_drafts").insert(draftData);
};

// Get all drafts
const getAllDrafts = async () => {
  try {
    const drafts = await knex("superadmin_drafts").select("*");
    return drafts;
  } catch (error) {
    console.error("Error fetching drafts:", error);
    throw error;
  }
};

// Get draft by title (optional)
const getDraftByTitle = async (title) => {
  return knex("superadmin_drafts")
    .where(knex.raw("LOWER(Title) = LOWER(?)", title))
    .first();
};

// Delete draft by ID (if you add an id column later)
const deleteDraft = async (id) => {
  return knex("superadmin_drafts").where({ id }).del();
};

// Update draft (if you add an id column later)
const updateDraft = async (id, draftData) => {
  return knex("superadmin_drafts").where({ id }).update(draftData);
};

module.exports = {
  createDraft,
  getAllDrafts,
  getDraftByTitle,
  deleteDraft,
  updateDraft,
};
