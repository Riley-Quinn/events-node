// migrations/20250716_create_ticket_status.js

exports.up = function (knex) {
  return knex.schema.createTable("task_status", function (table) {
    table.increments("status_id").primary();
    table.string("status_name", 50).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("task_status");
};
