const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const Permission = require("../models/Permission");

// All routes protected
router.use(authMiddleware);

// Get permissions for a role
router.get("/:roleId/permissions", roleController.getRolePermissions);
// Update role's permissions
router.put("/:roleId/permissions", roleController.updateRolePermissions);
router.get("/", async (req, res) => {
  try {
    const permissions = await Permission.getAll();
    res.json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res.status(500).json({ message: "Failed to fetch permissions" });
  }
});
module.exports = router;
