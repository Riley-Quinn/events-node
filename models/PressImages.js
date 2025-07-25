// models/Media.js
const db = require("../db");

module.exports = {
  create: (pressmedia) => db("press_images").insert(pressmedia),
  getAll: () => db("press_images").select("*"),
  getByPressId: (press_id) =>
    db("press_images").where({ press_id }).orderBy("image_id", "desc"),
  getById: (id) => db("press_images").where({ image_id: id }).first(),
  delete: (id) => db("press_images").where({ image_id: id }).del(),
};
