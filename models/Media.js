// models/Media.js
const db = require("../db");

module.exports = {
  create: (media) => db("media").insert(media),
  getAll: () => db("media").select("*"),
  getByEventId: (event_id) =>
    db("media").where({ event_id }).orderBy("id", "desc"),
  getById: (id) => db("media").where({ id }).first(),
  delete: (id) => db("media").where({ id }).del(),
};
