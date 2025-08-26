// superadminDraftRoutes.js
const express = require("express");
const router = express.Router();
const {
  createDraft,
  getAllDrafts,
  getDraftByTitle,
  updateDraft,
  deleteDraft,
  getDraftByUserId,
} = require("../models/SuperadminDraft");

// Create a new draft
router.post("/", async (req, res) => {
  try {
    const { Title, Description } = req.body;
    if (!Title || !Description) {
      return res
        .status(400)
        .json({ message: "Title and Description are required" });
    }

    // optional: check if draft with same title exists
    const existing = await getDraftByTitle(Title);
    if (existing) {
      return res
        .status(400)
        .json({ message: "Draft with this title already exists" });
    }
    const userId = req.user.id;
    await createDraft({ Title, Description, drafts_user_id: userId });
    res.status(201).json({ message: "Draft created successfully" });
  } catch (error) {
    console.error("Error creating draft:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all drafts
router.get("/", async (req, res) => {
  try {
    const drafts = await getAllDrafts();
    res.json(drafts);
  } catch (error) {
    console.error("Error fetching drafts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:drafts_user_id", async (req, res) => {
  try {
    const data = await getDraftByUserId(req.params.drafts_user_id);
    return res.status(200).json({ list: data });
  } catch (err) {
    res.status(500).json({ error: "Fetch by ID failed" });
  }
});
// Get draft by title
router.get("/:title", async (req, res) => {
  try {
    const draft = await getDraftByTitle(req.params.title);
    if (!draft) return res.status(404).json({ message: "Draft not found" });
    res.json(draft);
  } catch (error) {
    console.error("Error fetching draft:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Update draft (by title, since no id yet)
router.put("/:id", async (req, res) => {
  try {
    const { Title, Description } = req.body;
    const updated = await updateDraft(req.params.id, { Title, Description });
    if (!updated) return res.status(404).json({ message: "Draft not found" });
    res.json({ message: "Draft updated successfully" });
  } catch (error) {
    console.error("Error updating draft:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete draft (by title)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await deleteDraft(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Draft not found" });
    res.json({ message: "Draft deleted successfully" });
  } catch (error) {
    console.error("Error deleting draft:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
