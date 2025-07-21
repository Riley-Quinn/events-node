const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const User = require("../models/User");
const {
  authMiddleware,
  verifyToken,
} = require("../middlewares/authMiddleware");

router.post("/login", authController.login);
router.post("/register", authMiddleware, authController.register);
router.post("/logout", verifyToken, authController.logout);
router.get("/users", verifyToken, async (req, res) => {
  const user = req.user;

  try {
    if (user.role_id !== 1 && user.role_id !== 2) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Get All Users Error:", err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});
// Edit user
router.put("/users/:id", verifyToken, async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (user.role_id !== 1 && user.role_id !== 2) {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }

  try {
    await User.updateUser(id, req.body);
    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// Delete user
router.delete("/users/:id", verifyToken, async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (user.role_id !== 1 && user.role_id !== 2) {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }

  try {
    await User.deleteUser(id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: "Failed to delete user" });
  }
});
// Get user by ID
router.get("/users/:id", verifyToken, async (req, res) => {
  const user = req.user;
  const { id } = req.params;

  if (user.role_id !== 1 && user.role_id !== 2) {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }

  try {
    const foundUser = await User.getUserById(id);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(foundUser);
  } catch (err) {
    console.error("Get User By ID Error:", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

module.exports = router;
