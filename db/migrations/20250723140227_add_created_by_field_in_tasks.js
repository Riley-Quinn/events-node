exports.up = function (knex) {
  return knex.schema.alterTable("tasks", function (table) {
    table
      .string("created_by")
      .nullable()
      .defaultTo(null)
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    table
      .string("updated_by")
      .nullable()
      .defaultTo(null)
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("tasks", function (table) {
    table.dropColumn("created_by");
    table.dropColumn("updated_by");
  });
};
