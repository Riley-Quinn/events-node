// migrations/20250716_add_priority_to_tasks.js

exports.up = function (knex) {
  return knex.schema.table("tasks", function (table) {
    table.integer("priority").defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.table("tasks", function (table) {
    table.dropColumn("priority");
  });
};
