// categoryRoutes.js
const Category = require("../models/Category");
const express = require("express");
const router = express.Router();

router.get("/", getAllCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);

async function createCategory(req, res) {
  const { name } = req.body;
  try {
    const category = await Category.getCategoryByName(name);
    if (category) {
      return res.status(409).json({ error: "Category already exist" });
    }
    await Category.createCategory(req.body);
    return res.status(200).json({ message: "Category created successfully" });
  } catch (error) {
    console.error("Error creating category: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function updateCategory(req, res) {
  const { id } = req.params;
  try {
    await Category.updateCategory(id, req.body);
    return res.status(201).json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function getAllCategories(req, res) {
  const { is_active } = req.query;
  try {
    const data = await Category.getAllCategories(is_active);
    return res.status(200).json({ list: data });
  } catch (error) {
    console.error("Error fetching all categories: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = router;
