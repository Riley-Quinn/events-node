const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const User = require("../models/User");
const {
  authMiddleware,
  verifyToken,
} = require("../middlewares/authMiddleware");
const bcrypt = require("bcrypt");
const { encryptPassword } = require("../utils");

router.post("/login", authController.login);
router.post("/register", authMiddleware, authController.register);
router.post("/logout", verifyToken, authController.logout);

router.get("/", verifyToken, async (req, res) => {
  const user = req.user;
  try {
    if (!user) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Internal Server error" });
  }
});

router.get("/users", verifyToken, async (req, res) => {
  const user = req.user;

  try {
    // if (user.role_id !== 1 && user.role_id !== 2) {
    //   return res
    //     .status(200)
    //     .json({ list: [], message: "Forbidden: Access denied" });
    // }

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
  try {
    const user = req.user;
    const { id } = req.params;
    if (user.role_id !== 1 && user.role_id !== 2 && user?.id !== id) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

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
// Change password
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old and new password are required" });
    }

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashed = await encryptPassword(newPassword);
    await User.updatePassword(userId, hashed);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("Change Password Error:", err);
    res.status(500).json({ message: "Failed to update password" });
  }
});

module.exports = router;
