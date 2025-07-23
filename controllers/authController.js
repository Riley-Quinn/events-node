const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const db = require("../db");
const { encryptPassword, generateUniqueId } = require("../utils");

exports.register = async (req, res) => {
  const { name, email, password, role_id, phone, address } = req.body;
  const creator = req.user;

  try {
    if (!creator) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (creator.role_id === 2 && role_id === 1) {
      return res
        .status(403)
        .json({ message: "Org Admin cannot create Super Admins" });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    let unqId;
    let isUnique = false;

    while (!isUnique) {
      unqId = generateUniqueId();
      const userData = await User.getUserById(unqId);
      if (!userData) {
        isUnique = true;
      }
    }

    const hashedPassword = await encryptPassword(password);
    await User.create({
      id: unqId,
      name,
      email,
      password: hashedPassword,
      role_id,
      phone,
      address,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ message: "Invalid Email" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const permissions = await User.getPermissions(user.id);

    const token = jwt.sign(
      {
        id: user.id,
        role_id: user.role_id,
        permissions,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role_id: user.role_id,
        name: user.name,
      },
      permissions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ message: "Token is required" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const expiryDate = new Date(decoded.exp * 1000);

    await db("token_blacklist").insert({
      token,
      expiry: expiryDate,
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Logout failed" });
  }
};
