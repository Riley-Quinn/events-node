const express = require("express");
const router = express.Router();
const PressRelease = require("../models/PressRelease");

// Create
router.post("/create", async (req, res) => {
  try {
    const user = req.user;
    const press = await PressRelease.createPressRelease({
      ...req.body,
      created_by: user?.id,
    });
    res.json({ message: "Press release created", press });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Creation failed" });
  }
});

// Get all
router.get("/", async (req, res) => {
  try {
    const data = await PressRelease.getAllPressReleases();
    res.json(data);
  } catch (err) {
    console.error("Error fetching all press releases", err);
    res.status(500).json({ error: "Fetch failed" });
  }
});

// Get by ID
router.get("/:press_id", async (req, res) => {
  try {
    const data = await PressRelease.getPressReleaseById(req.params.press_id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Fetch by ID failed" });
  }
});

// Update
router.put("/:press_id", async (req, res) => {
  try {
    const user = req.user;
    await PressRelease.updatePressRelease(req.params.press_id, {
      ...req.body,
      updated_by: user?.id,
    });
    res.json({ message: "Updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// Delete
router.delete("/:press_id", async (req, res) => {
  try {
    await PressRelease.deletePressRelease(req.params.press_id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});
router.put("/:press_id/status", async (req, res) => {
  try {
    const { press_id } = req.params;
    const { status_id } = req.body;

    await PressRelease.updatePressReleaseStatus(press_id, status_id);
    res.json({ message: "Press Release status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update press release status" });
  }
});
module.exports = router;
