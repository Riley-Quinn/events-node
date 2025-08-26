const express = require("express");
const router = express.Router();
const PressRelease = require("../models/PressRelease");
const { generateUniqueId } = require("../utils");
const knex = require("../db");

// Create
router.post("/create", async (req, res) => {
  try {
    const user = req.user;
    let unqId;
    let isUnique = false;
    while (!isUnique) {
      unqId = generateUniqueId();
      const pressReleaseData = await PressRelease.getPressReleaseById(unqId);
      if (!pressReleaseData) {
        isUnique = true;
      }
    }
    await PressRelease.createPressRelease({
      ...req.body,
      press_id: unqId,
      created_by: user?.id,
    });
    res.json({ message: "Press release created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Creation failed" });
  }
});

// Get all
router.get("/", async (req, res) => {
  try {
    const user = req.user;
    const permissions = user?.permissions || [];
    const showAll = req.query.all === "true";

    const hasElevatedAccess = permissions.some(
      (p) =>
        (p.action === "modify" && p.subject.toLowerCase() === "permission") ||
        (p.action === "manage" && p.subject.toLowerCase() === "user")
    );

    let pressReleases;
    if (hasElevatedAccess) {
      pressReleases = await PressRelease.getFilteredPressReleases(
        null,
        showAll
      );
    } else {
      pressReleases = await PressRelease.getFilteredPressReleases(
        user?.id,
        showAll,
        user?.role_id
      );
    }

    res.status(200).json({ list: pressReleases });
  } catch (err) {
    console.error("Error fetching press releases", err);
    res.status(500).json({ error: "Failed to fetch press releases" });
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

router.post("/update-priority", async (req, res) => {
  try {
    const { press } = req.body; // [{ task_id, priority }]

    await PressRelease.updatePressReleasePriorities(press);

    res.status(200).json({ message: "Priority updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update task priorities" });
  }
});

router.put("/reorder", async (req, res) => {
  const trx = await knex.transaction();
  try {
    const updates = req.body; // [{ task_id: 1, priority: 1 }, ...]
    for (const item of updates) {
      await knex("press_releases")
        .where("press_id", item.press_id)
        .update({ priority: item.priority })
        .transacting(trx);
    }
    await trx.commit();
    res.json({ message: "Priority updated" });
  } catch (err) {
    await trx.rollback();
    res.status(500).json({ error: "Failed to reorder press releases" });
  }
});
// Delete
router.delete("/:press_id", async (req, res) => {
  try {
    const { press_id } = req.params;
    console.log("Deleting press_id:", press_id);

    // Start a transaction
    await knex.transaction(async (trx) => {
      // 1. Delete related media first
      await trx("press_images").where("press_id", press_id).del();

      // 2. Delete the press release itself
      const deleted = await trx("press_releases")
        .where("press_id", press_id)
        .del();

      if (deleted === 0) {
        throw new Error("Press release not found");
      }
    });

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("Delete route error:", err);
    res.status(500).json({ error: "Delete failed", details: err.message });
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
