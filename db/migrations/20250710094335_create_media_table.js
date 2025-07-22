exports.up = function (knex) {
  return knex.schema.createTable("media", (table) => {
    table.increments("id").primary();
    table.string("type"); // image, video, document, link
    table.string("url");
    table.integer("event_id").unsigned().references("id").inTable("events");
    table.uuid("uploaded_by").references("id").inTable("users");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("media");
};
