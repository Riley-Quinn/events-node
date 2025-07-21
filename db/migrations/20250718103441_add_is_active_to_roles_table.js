// migrations/20250716_add_is_active_to_roles.js

exports.up = function (knex) {
  return knex.schema.table("roles", function (table) {
    table.boolean("is_active").notNullable().defaultTo(true);
  });
};

exports.down = function (knex) {
  return knex.schema.table("roles", function (table) {
    table.dropColumn("is_active");
  });
};
