// migrations/20250718_create_sub_categories.js

exports.up = function (knex) {
  return knex.schema.createTable("sub_categories", (table) => {
    table.increments("sub_category_id").primary();
    table.string("name", 100).notNullable();
    table
      .integer("category_id")
      .unsigned()
      .references("category_id")
      .inTable("categories")
      .onDelete("CASCADE");
    table.boolean("is_active").defaultTo(1);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("sub_categories");
};
