exports.up = function (knex) {
  return knex.schema.alterTable("tasks", function (table) {
    table
      .integer("sub_category_id")
      .unsigned() // ✅ ensures it matches `sub_categories.sub_category_id`
      .nullable()
      .defaultTo(null)
      .references("sub_category_id")
      .inTable("sub_categories")
      .onDelete("SET NULL"); // optional, but recommended
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("tasks", function (table) {
    table.dropColumn("sub_category_id");
  });
};
