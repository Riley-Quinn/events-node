const knex = require("../db");

class FcmToken {
  static async saveToken(userId, fcmToken) {
    try {
      const existingToken = await knex("fcm_tokens")
        .where({
          user_id: userId,
          fcm_token: fcmToken,
        })
        .first();

      if (!existingToken) {
        await knex("fcm_tokens").insert({
          user_id: userId,
          fcm_token: fcmToken,
        });
      }
    } catch (error) {
      logger.error("Error saving FCM token:", error);
      throw error;
    }
  }

  static async getTokenByUserId(userId) {
    try {
      return await knex("fcm_tokens")
        .where({ user_id: userId })
        .select("fcm_token");
    } catch (error) {
      console.error("Error fetching FCM token:", error);
      throw error;
    }
  }

  static async getUserIdByToken(fcmToken) {
    try {
      return await knex("fcm_tokens")
        .where({ fcm_token: fcmToken })
        .select("fcm_token")
        .first();
    } catch (error) {
      console.error("Error fetching FCM token by token:", error);
      throw error;
    }
  }

  static async updateUserIdByToken(userId, fcmToken) {
    try {
      return await knex("fcm_tokens")
        .update({ user_id: userId })
        .where({ fcm_token: fcmToken });
    } catch (error) {
      console.error("Error updating user ID by token:", error);
      throw error;
    }
  }

  static async deleteToken(userId, fcmToken) {
    try {
      return await knex("fcm_tokens")
        .where({ user_id: userId, fcm_token: fcmToken })
        .del();
    } catch (error) {
      console.error("Error deleting FCM token:", error);
      throw error;
    }
  }

  // ✅ NEW METHOD TO FETCH ALL TOKENS
  static async getAllTokens() {
    try {
      return await knex("fcm_tokens").select("fcm_token");
    } catch (error) {
      console.error("Error fetching all FCM tokens:", error);
      throw error;
    }
  }
}

module.exports = FcmToken;
