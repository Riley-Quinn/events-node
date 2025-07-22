const express = require("express");
const router = express.Router();
const Birthday = require("../models/Birthdays");

// Create
router.post("/create", async (req, res) => {
  try {
    await Birthday.createBirthday(req.body);
    res.json({ message: "Birthday added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add birthday" });
  }
});

// Get All
router.get("/all", async (req, res) => {
  try {
    const birthdays = await Birthday.getAllBirthdays();
    res.json(birthdays);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch birthdays" });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    await Birthday.updateBirthday(req.params.id, req.body);
    res.json({ message: "Birthday updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update birthday" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await Birthday.deleteBirthday(req.params.id);
    res.json({ message: "Birthday deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete birthday" });
  }
});

module.exports = router;
