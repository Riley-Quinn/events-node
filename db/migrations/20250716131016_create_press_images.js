// migrations/20250716_create_press_images.js

exports.up = function (knex) {
  return knex.schema.createTable("press_images", function (table) {
    table.increments("image_id").primary();
    table
      .integer("press_id")
      .unsigned()
      .references("press_id")
      .inTable("press_releases")
      .onDelete("CASCADE");
    table.string("file_name", 255).notNullable();
    table.string("file_url", 500).notNullable();
    table.string("file_path", 500).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("press_images");
};
