/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.table("superadmin_drafts", function (table) {
    table.string("drafts_user_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.table("superadmin_drafts", function (table) {
    table.dropColumn("drafts_user_id");
  });
};
