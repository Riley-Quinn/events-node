const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");
const { authMiddleware } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/", roleController.getAllRoles);
router.get("/list/for-tasks", roleController.getRolesForTasks);
router.post("/create", roleController.createRole);
router.put("/:roleId", roleController.updateRole);
router.delete("/:roleId", roleController.deleteRole);

module.exports = router;
