exports.up = function (knex) {
  return knex.schema.createTable("role_permissions", (table) => {
    table.increments("id").primary();
    table
      .integer("role_id")
      .unsigned()
      .references("id")
      .inTable("roles")
      .onDelete("CASCADE");
    table
      .integer("permission_id")
      .unsigned()
      .references("id")
      .inTable("permissions")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("role_permissions");
};
