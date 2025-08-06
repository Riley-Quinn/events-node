const express = require("express");
const router = express.Router();
const SubCategory = require("../models/SubCategory");

// Create Sub Category
router.post("/", async (req, res) => {
  try {
    const { name, category_id } = req.body;
    await SubCategory.createSubCategory({ name, category_id });
    res.status(200).json({ message: "Sub Category created successfully" });
  } catch (error) {
    console.error("Error creating sub category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get All Sub Categories
router.get("/", async (req, res) => {
  try {
    const subCategories = await SubCategory.getAllSubCategories();
    res.status(200).json({ list: subCategories });
  } catch (error) {
    console.error("Error fetching sub categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update Sub Category
router.put("/:id", async (req, res) => {
  try {
    await SubCategory.updateSubCategory(req.params.id, req.body);
    res.status(200).json({ message: "Sub Category updated successfully" });
  } catch (error) {
    console.error("Error updating sub category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get Sub Categories by Category ID
router.get("/category/:categoryId", async (req, res) => {
  try {
    const data = await SubCategory.getSubCategoriesByCategory(
      req.params.categoryId
    );
    res.status(200).json({ list: data });
  } catch (error) {
    console.error("Error fetching sub categories by category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await SubCategory.deleteSubCategory(req.params.id);
    res.status(200).json({ message: "Sub Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting sub category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
