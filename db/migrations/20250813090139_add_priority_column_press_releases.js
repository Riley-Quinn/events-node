exports.up = function (knex) {
  return knex.schema.table("press_releases", function (table) {
    table.integer("priority").defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.table("press_releases", function (table) {
    table.dropColumn("priority");
  });
};
