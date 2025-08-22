/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("superadmin_drafts", function (table) {
    table.increments("id").primary();
    table.string("Title").notNullable();
    table.string("Description").notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("superadmin_drafts");
};
