exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name");
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table
      .integer("role_id")
      .unsigned()
      .references("id")
      .inTable("roles")
      .onDelete("SET NULL");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
