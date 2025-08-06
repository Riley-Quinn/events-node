const knex = require("../db");
const moment = require("moment");

const createImportantDays = (data) => knex("importantDays").insert(data);
const updateImportantDays = (id, data) =>
  knex("importantDays").where({ id }).update(data);
const deleteImportantDays = (id) => knex("importantDays").where({ id }).del();
const getAllImportantDays = () => knex("importantDays").where({ is_active: 1 });
// Get birthdays happening tomorrow
const getTomorrowImportantDays = async () => {
  const tomorrow = moment().add(1, "days");
  const month = tomorrow.format("MM");
  const day = tomorrow.format("DD");

  return await knex("importantDays")
    .whereRaw("MONTH(importantDay_date) = ?", [month])
    .andWhereRaw("DAY(importantDay_date) = ?", [day])
    .andWhere({ is_active: 1 });
};
module.exports = {
  createImportantDays,
  updateImportantDays,
  deleteImportantDays,
  getAllImportantDays,
  getTomorrowImportantDays,
};
