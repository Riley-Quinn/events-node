exports.up = function (knex) {
  return knex.schema.createTable("press_images", (table) => {
    table.increments("image_id").primary();
    table.string("type"); // image, video, document, link
    table.string("url");
    table.string("press_id").references("press_id").inTable("press_releases");
    table.string("uploaded_by").references("id").inTable("users");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("press_images");
};
