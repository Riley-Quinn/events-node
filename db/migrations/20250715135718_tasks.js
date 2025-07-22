// migrations/20250716_create_tasks.js

exports.up = function (knex) {
  return knex.schema.createTable("tasks", function (table) {
    table.increments("task_id").primary();
    table.string("title", 255).notNullable();
    table.text("description");
    table.string("location", 255);

    // Foreign Keys
    table.uuid("assignee_id").references("id").inTable("users");
    table
      .integer("category_id")
      .unsigned()
      .references("category_id")
      .inTable("categories")
      .onDelete("SET NULL");
    table
      .integer("status_id")
      .unsigned()
      .references("status_id")
      .inTable("task_status")
      .onDelete("SET NULL")
      .defaultTo(1);
    // Timestamps
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("tasks");
};
