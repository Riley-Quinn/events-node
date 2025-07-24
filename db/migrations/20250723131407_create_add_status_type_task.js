/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable("task_status", function (table) {
    table
      .enum("status_type", ["task", "press_release"])
      .notNullable()
      .defaultTo("task");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable("task_status", function (table) {
    table.dropColumn("status_type");
  });
};
