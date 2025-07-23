//Category.js ---> model

// Category.js
const knex = require("../db");

const createCategory = async (categoryData) => {
  return knex("categories").insert(categoryData);
};

const updateCategory = async (categoryId, categoryData) => {
  return knex("categories")
    .update(categoryData)
    .where({ category_id: categoryId });
};

// Get all categories
const getAllCategories = async () => {
  try {
    const categories = await knex("categories").select("*");
    return categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

const getCategoryId = async (categoryId) => {
  return knex("categories").where({ category_id: categoryId }).first();
};

const getCategoryByName = async (categoryName) => {
  return knex("categories")
    .where(knex.raw("LOWER(name) = LOWER(?)", categoryName))
    .first();
};
const deleteCategory = async (categoryId) => {
  return knex("categories").where({ category_id: categoryId }).del();
};
module.exports = {
  getAllCategories,
  getCategoryId,
  createCategory,
  getCategoryByName,
  updateCategory,
  deleteCategory,
};
