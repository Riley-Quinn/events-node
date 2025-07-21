const knex = require("../db");

const Permission = {
  async getAll() {
    return knex("permissions").select("*");
  },
};

module.exports = Permission;
