exports.up = function (knex) {
  return knex.schema.alterTable("tasks", function (table) {
    table.date("start_date").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("tasks", function (table) {
    table.dropColumn("start_date");
  });
};
