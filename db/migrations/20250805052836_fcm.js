exports.up = function (knex) {
  return knex.schema.createTable("fcm_tokens", function (table) {
    table.increments("id").primary();
    table.string("user_id").notNullable();
    table.string("fcm_token").notNullable();
    table.timestamps(true, true);

    // Match string type for user_id
    table
      .foreign("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("fcm_tokens");
};
