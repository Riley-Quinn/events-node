const knex = require("../db");
const moment = require("moment");

const createBirthday = (data) => knex("birthdays").insert(data);
const updateBirthday = (id, data) =>
  knex("birthdays").where({ id }).update(data);
const deleteBirthday = (id) => knex("birthdays").where({ id }).del();
const getAllBirthdays = () => knex("birthdays").where({ is_active: 1 });

// Get birthdays happening tomorrow
const getTomorrowBirthdays = async () => {
  const tomorrow = moment().add(1, "days");
  const month = tomorrow.format("MM");
  const day = tomorrow.format("DD");

  return await knex("birthdays")
    .whereRaw("MONTH(birth_date) = ?", [month])
    .andWhereRaw("DAY(birth_date) = ?", [day])
    .andWhere({ is_active: 1 });
};

module.exports = {
  createBirthday,
  updateBirthday,
  deleteBirthday,
  getAllBirthdays,
  getTomorrowBirthdays,
};
