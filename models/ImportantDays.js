const knex = require("../db");

const createImportantDays = (data) => knex("importantDays").insert(data);
const updateImportantDays = (id, data) =>
  knex("importantDays").where({ id }).update(data);
const deleteImportantDays = (id) => knex("importantDays").where({ id }).del();
const getAllImportantDays = () => knex("importantDays").where({ is_active: 1 });

module.exports = {
  createImportantDays,
  updateImportantDays,
  deleteImportantDays,
  getAllImportantDays,
};
