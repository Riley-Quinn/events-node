const knex = require("../db");

const Events = {
  getAll: () => knex("events").select("*"),

  getById: (id) => knex("events").where({ id }).first(),

  create: (data) => knex("events").insert(data),

  update: (id, data) => knex("events").where({ id }).update(data),

  delete: (id) => knex("events").where({ id }).del(),
};

module.exports = Events;
