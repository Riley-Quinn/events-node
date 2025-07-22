exports.up = function (knex) {
  return knex.schema.createTable("importantDays", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.date("importantDay_date").notNullable(); // Save only date, no time
    table.boolean("is_active").defaultTo(1);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("importantDays");
};
