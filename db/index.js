const config = require("../knexfile");
require("dotenv").config();
const env = "development";

const db = require("knex")(config[env]);

module.exports = db;
