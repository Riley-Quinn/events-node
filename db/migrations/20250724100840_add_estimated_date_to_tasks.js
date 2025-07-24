// migrations/XXXXXX_add_estimated_date_to_tasks.js

exports.up = function (knex) {
  return knex.schema.alterTable("tasks", function (table) {
    table.date("estimated_date").nullable(); // ✅ Add date column
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("tasks", function (table) {
    table.dropColumn("estimated_date"); // 🔁 Rollback support
  });
};
