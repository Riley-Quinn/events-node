const cron = require("node-cron");
const moment = require("moment");
const admin = require("firebase-admin");
const Event = require("../models/Events");
const knex = require("../db"); // Adjust the path as needed
const importantDays = require("../models/ImportantDays");

const Birthday = require("../models/Birthdays");
const FcmToken = require("../models/tokens"); // Adjust if needed

cron.schedule("00 06 * * *", async () => {
  try {
    if (!process.env.ENABLE_CRON_JOB) return;

    console.log(`[${new Date()}] Birthday Notification Cron Started`);

    const birthdays = await Birthday.getTomorrowBirthdays();

    if (birthdays.length === 0) {
      console.log("No birthdays tomorrow.");
      return;
    }

    const tokens = await FcmToken.getAllTokens(); // All user tokens once
    if (!tokens.length) {
      console.log("No FCM tokens found.");
      return;
    }

    const allUserTokens = tokens.map((t) => t.fcm_token);

    for (let person of birthdays) {
      const message = {
        notification: {
          title: "🎉 Upcoming Birthday!",
          body: `Tomorrow is ${person.name}'s birthday! `,
        },
        data: {
          type: "birthday",
          user: person.name,
        },
        tokens: allUserTokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(
        `[${new Date()}] Sent birthday notification for ${person.name} to ${
          response.successCount
        } users`
      );
    }

    console.log(`[${new Date()}] Birthday Notification Cron Completed`);
  } catch (err) {
    console.error(`[${new Date()}] Birthday Cron Error: ${err}`);
  }
});

cron.schedule("00 06 * * *", async () => {
  try {
    if (!process.env.ENABLE_CRON_JOB) return;

    console.log(`[${new Date()}] importantDays Notification Cron Started`);

    const events = await importantDays.getTomorrowImportantDays(); // Make sure this is correctly exported in your model

    if (!events || events.length === 0) {
      console.log("No important days tomorrow.");
      return;
    }

    const tokens = await FcmToken.getAllTokens();
    if (!tokens.length) {
      console.log("No FCM tokens found.");
      return;
    }

    const allUserTokens = tokens.map((t) => t.fcm_token);

    for (let event of events) {
      const message = {
        notification: {
          title: " Upcoming Important Day!",
          body: `Tomorrow is ${event.name}'s important day.`,
        },
        data: {
          type: "importantDays",
          user: event.name,
        },
        tokens: allUserTokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(
        `[${new Date()}] Sent notification for ${event.name} to ${
          response.successCount
        } users`
      );
    }

    console.log(`[${new Date()}] importantDays Notification Cron Completed`);
  } catch (err) {
    console.error(`[${new Date()}] importantDays Cron Error: ${err}`);
  }
});
cron.schedule("00 09 * * *", async () => {
  // Runs every 5 minutes – adjust as needed
  try {
    if (!process.env.ENABLE_CRON_JOB) return;

    console.log(`[${new Date()}] Event Notification Cron Started`);

    const rolesWithViewEventPerm = await knex("role_permissions")
      .where("permission_id", 1)
      .pluck("role_id");

    if (!rolesWithViewEventPerm.length) {
      console.log("❌ No roles with view_event permission.");
      return;
    }

    const usersWithRoles = await knex("users")
      .whereIn("role_id", rolesWithViewEventPerm)
      .pluck("id");

    if (!usersWithRoles.length) {
      console.log("❌ No users with required roles.");
      return;
    }

    const tokens = await knex("fcm_tokens")
      .whereIn("user_id", usersWithRoles)
      .pluck("fcm_token");

    if (!tokens.length) {
      console.log("❌ No FCM tokens found for eligible users.");
      return;
    }

    const now = moment();
    const today = now.format("YYYY-MM-DD");
    const currentTime = now.format("HH:mm");
    const oneHourLater = now.clone().add(1, "hours").format("HH:mm");

    const upcomingEvents = await knex("events")
      .where("date", today)
      .andWhere("time", ">=", currentTime)
      .andWhere("time", "<=", oneHourLater);

    if (!upcomingEvents.length) {
      console.log("✅ No events starting in 1 hour.");
      return;
    }

    for (let event of upcomingEvents) {
      const message = {
        notification: {
          title: "Upcoming Event!",
          body: `${event.title} starts in 1 hour.`,
        },
        data: {
          type: "event",
          event_id: event.id.toString(),
        },
        tokens: tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(
        `✅ Sent notification for '${event.title}' to ${response.successCount} users`
      );
    }

    console.log(`[${new Date()}] Event Notification Cron Completed`);
  } catch (err) {
    console.error(`[${new Date()}] Event Cron Error: ${err.message}`);
  }
});
cron.schedule("0 * * * *", async () => {
  try {
    if (!process.env.ENABLE_CRON_JOB) return;

    console.log(`[${new Date()}] Task Notification Cron Started`);

    const today = moment().format("YYYY-MM-DD");

    const todayTasks = await knex("tasks")
      .where("status_id", 1)
      .andWhereRaw("DATE(start_date) = ?", [today]);

    if (!todayTasks.length) {
      console.log("✅ No tasks scheduled for today.");
      return;
    }

    for (const task of todayTasks) {
      const { assignee_id, task_id, title, start_date } = task;

      const tokens = await knex("fcm_tokens")
        .where("user_id", assignee_id)
        .pluck("fcm_token");

      if (!tokens || tokens.length === 0) {
        console.log(`❌ No FCM token found for user ${assignee_id}`);
        continue;
      }

      const message = {
        notification: {
          title: " Task Reminder",
          body: `Your task "${title}" is scheduled for today at ${moment(
            start_date
          ).format("hh:mm A")}`,
        },
        data: {
          type: "task",
          task_id: task_id.toString(),
        },
        tokens: tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);
      console.log(
        `✅ Notification sent for task '${title}' to ${response.successCount} users.`
      );
    }

    console.log(`[${new Date()}] Task Notification Cron Completed`);
  } catch (err) {
    console.error(`[${new Date()}] Task Cron Error: ${err.message}`);
  }
});

cron.schedule("0 * * * *", async () => {
  try {
    if (!process.env.ENABLE_CRON_JOB) return;

    console.log(`[${new Date()}] Task Notification Cron Started`);

    const today = moment().format("YYYY-MM-DD");

    const todayTasks = await knex("tasks")
      .where("status_id", 1)
      .andWhereRaw("DATE(start_date) = ?", [today]);

    if (!todayTasks.length) {
      console.log("✅ No tasks scheduled for today.");
      return;
    }

    for (const task of todayTasks) {
      const { assignee_id, task_id, title, start_date, created_by } = task;

      const assignee = await knex("users")
        .where("id", assignee_id)
        .select("name")
        .first();
      const assigneeName = assignee?.name || "Unknown User";

      const assigner = await knex("users")
        .where("id", created_by)
        .select("name")
        .first();
      const assignerName = assigner?.name || "Someone";

      const tokens = await knex("fcm_tokens")
        .where("user_id", assignee_id)
        .pluck("fcm_token");

      if (!tokens || tokens.length === 0) {
        console.log(`❌ No FCM token found for ${assigneeName}`);
        continue;
      }

      const message = {
        notification: {
          title: "Task Assigned",
          body: `Task "${title}" is assigned to you by ${assignerName}`,
        },
        data: {
          type: "task",
          task_id: task_id.toString(),
        },
        tokens: tokens,
      };

      const response = await admin.messaging().sendEachForMulticast(message);

      console.log(
        ` Notification sent: Task '${title}' assigned to ${assigneeName} by ${assignerName}`
      );
    }

    console.log(`[${new Date()}] Task Notification Cron Completed`);
  } catch (err) {
    console.error(`[${new Date()}] Task Cron Error: ${err.message}`);
  }
});
