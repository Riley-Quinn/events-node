const express = require("express");
const router = express.Router();
const ImportantDay = require("../models/ImportantDays");

// Create
router.post("/create", async (req, res) => {
  try {
    await ImportantDay.createImportantDays(req.body);
    res.json({ message: "ImportantDay added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add importantDay" });
  }
});

// Get All
router.get("/all", async (req, res) => {
  try {
    const importantDays = await ImportantDay.getAllImportantDays();
    res.json(importantDays);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch importantDays" });
  }
});

// Update
router.put("/:id", async (req, res) => {
  try {
    await ImportantDay.updateImportantDays(req.params.id, req.body);
    res.json({ message: "ImportantDay updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update importantDay" });
  }
});

// Delete
router.delete("/:id", async (req, res) => {
  try {
    await ImportantDay.deleteImportantDays(req.params.id);
    res.json({ message: "ImportantDay deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete importantDays" });
  }
});

module.exports = router;
