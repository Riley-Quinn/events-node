// migrations/YYYYMMDD_create_token_blacklist_table.js

exports.up = function (knex) {
  return knex.schema.createTable("token_blacklist", (table) => {
    table.increments("id").primary();
    table.text("token").notNullable();
    table.datetime("expiry").notNullable();
    table.timestamps(true, true); // created_at, updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("token_blacklist");
};
