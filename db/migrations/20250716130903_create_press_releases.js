// migrations/20250716_create_press_releases.js

exports.up = function (knex) {
  return knex.schema.createTable("press_releases", function (table) {
    table.increments("press_id").primary();
    table.string("title", 255).notNullable();
    table.text("notes").nullable();
    table.uuid("assignee_id").references("id").inTable("users");
    table
      .integer("status_id")
      .unsigned()
      .references("status_id")
      .inTable("task_status")
      .onDelete("SET NULL")
      .defaultTo(1);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("press_releases");
};
