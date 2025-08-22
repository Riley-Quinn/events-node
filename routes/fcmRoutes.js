const express = require("express");
const router = express.Router();
const FcmToken = require("../models/tokens");
const admin = require("firebase-admin");

// Store FCM token
router.post("/store-token", async (req, res) => {
  const { user_id, fcm_token } = req.body;

  if (!user_id || !fcm_token) {
    return res
      .status(400)
      .json({ message: "User ID and FCM token are required" });
  }

  try {
    const fcmData = await FcmToken.getUserIdByToken(fcm_token);

    if (!fcmData) {
      await FcmToken.saveToken(user_id, fcm_token);
    } else {
      await FcmToken.updateUserIdByToken(user_id, fcm_token);
    }

    return res.json({ message: "Token stored successfully" });
  } catch (error) {
    console.error("Error saving FCM token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Send notification
router.post("/send-notification", async (req, res) => {
  const { user_id, title, body } = req.body;

  if (!user_id || !title || !body) {
    return res
      .status(400)
      .json({ message: "User ID, title, body, and are required" });
  }

  try {
    const tokensData = await FcmToken.getTokenByUserId(user_id);

    if (!tokensData || tokensData.length === 0) {
      return res
        .status(404)
        .json({ message: "No FCM tokens found for this user" });
    }

    const fcmTokens = tokensData.map((tokenObj) => tokenObj.fcm_token);
    const message = {
      notification: { title, body },
      tokens: fcmTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    return res.json({
      message: "Notification sent successfully",
      successCount: response.successCount,
      failureCount: response.failureCount,
    });
  } catch (error) {
    console.error("Error sending notification:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Remove token
router.post("/remove-token", async (req, res) => {
  const { user_id, fcm_token } = req.body;

  if (!user_id || !fcm_token) {
    return res
      .status(400)
      .json({ message: "User ID and FCM token are required" });
  }

  try {
    await FcmToken.deleteToken(user_id, fcm_token);
    return res.json({ message: "Token removed successfully" });
  } catch (error) {
    console.error("Error removing token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
