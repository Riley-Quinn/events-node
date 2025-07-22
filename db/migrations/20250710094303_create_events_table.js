exports.up = function (knex) {
  return knex.schema.createTable("events", function (table) {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("description").nullable();
    table.date("date").notNullable();
    table.time("time").notNullable();
    table.string("location").nullable();
    table.timestamps(true, true); // created_at & updated_at
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("events");
};
