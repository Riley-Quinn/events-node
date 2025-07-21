exports.up = function (knex) {
  return knex.schema.createTable("permissions", (table) => {
    table.increments("id").primary();
    table.string("action").notNullable();
    table.string("subject").notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("permissions");
};
