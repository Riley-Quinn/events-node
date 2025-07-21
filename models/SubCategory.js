const knex = require("../db");

const createSubCategory = async (subCategoryData) => {
  return knex("sub_categories").insert(subCategoryData);
};

const updateSubCategory = async (subCategoryId, subCategoryData) => {
  return knex("sub_categories")
    .update(subCategoryData)
    .where({ sub_category_id: subCategoryId });
};

const getAllSubCategories = async () => {
  return knex("sub_categories")
    .select("sub_categories.*", "categories.name as category_name")
    .leftJoin(
      "categories",
      "sub_categories.category_id",
      "categories.category_id"
    );
};

const getSubCategoriesByCategory = async (categoryId) => {
  return knex("sub_categories").where({ category_id: categoryId });
};

module.exports = {
  createSubCategory,
  updateSubCategory,
  getAllSubCategories,
  getSubCategoriesByCategory,
};
