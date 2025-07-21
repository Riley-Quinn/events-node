/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    // Corrected field types
    table.string("phone"); // ✅ phone as string
    table.text("address");
    table.boolean("is_active").notNullable().defaultTo(true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    // Correctly drop columns from 'users' table
    table.dropColumn("phone");
    table.dropColumn("address");
    table.dropColumn("is_active");
  });
};
