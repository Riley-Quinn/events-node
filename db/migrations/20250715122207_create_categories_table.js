exports.up = function (knex) {
  return knex.schema.createTable("categories", (table) => {
    table.increments("category_id").primary();
    table.string("name", 100).notNullable();
    table.boolean("is_active").defaultTo(1);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("categories");
};
