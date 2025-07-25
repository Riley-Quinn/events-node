exports.up = function (knex) {
  return knex.schema.createTable("tbl_comments", function (table) {
    table.string("comment_id").primary().notNullable();
    table.string("task_id").references("task_id").inTable("tasks").nullable();
    table
      .string("press_id")
      .references("press_id")
      .inTable("press_releases")
      .nullable();
    table
      .string("commented_by")
      .references("id")
      .inTable("users")
      .notNullable();
    table.text("comment").notNullable();
    table.enum("comments_module", ["task", "press_release"]).notNullable();
    table.boolean("is_deleted").notNullable().defaultTo(false);
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("tbl_comments");
};
