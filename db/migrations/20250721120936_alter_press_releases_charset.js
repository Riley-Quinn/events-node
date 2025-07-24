exports.up = function (knex) {
  return knex.raw(`
    ALTER TABLE press_releases 
    MODIFY notes TEXT 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci
  `);
};

exports.down = function (knex) {
  return knex.raw(`
    ALTER TABLE press_releases 
    MODIFY notes TEXT 
    CHARACTER SET utf8 
    COLLATE utf8_general_ci
  `);
};
