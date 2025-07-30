exports.up = async function (knex) {
  await knex.schema.alterTable("tasks", (table) => {
    table.integer("role_id").unsigned().nullable().after("assignee_id");
    table.foreign("role_id").references("id").inTable("roles");
  });
};

exports.down = async function (knex) {
  await knex.schema.alterTable("tasks", (table) => {
    table.dropForeign(["role_id"]);
    table.dropColumn("role_id");
  });
};
