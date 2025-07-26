exports.up = function (knex) {
  return knex.schema.createTable("task_status_tracker", function (table) {
    table.increments("id").primary();

    table.string("task_id").notNullable(); // task_id from tasks table
    table.integer("old_status_id").nullable(); // previous status
    table.integer("new_status_id").notNullable(); // updated status
    table.string("changed_by").notNullable(); // user_id from users table

    table.timestamp("changed_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("task_status_tracker");
};
