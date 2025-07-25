exports.up = function (knex) {
  return knex.schema.alterTable("tasks", function (table) {
    table.boolean("is_important").defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("tasks", function (table) {
    table.dropColumn("is_important");
  });
};
