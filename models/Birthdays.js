const knex = require("../db");

const createBirthday = (data) => knex("birthdays").insert(data);
const updateBirthday = (id, data) =>
  knex("birthdays").where({ id }).update(data);
const deleteBirthday = (id) => knex("birthdays").where({ id }).del();
const getAllBirthdays = () => knex("birthdays").where({ is_active: 1 });

module.exports = {
  createBirthday,
  updateBirthday,
  deleteBirthday,
  getAllBirthdays,
};
