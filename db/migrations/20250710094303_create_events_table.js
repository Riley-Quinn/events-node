exports.up = function (knex) {
  return knex.schema.createTable("events", (table) => {
    table.increments("id").primary();
    table.string("title");
    table.text("description");
    table.boolean("is_postponed").defaultTo(false);
    table.integer("created_by").unsigned().references("id").inTable("users");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("events");
};
