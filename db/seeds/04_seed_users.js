const bcrypt = require("bcrypt");
const { generateUniqueId } = require("../../utils");

exports.seed = async function (knex) {
  // Delete in the right dependency order
  await knex("press_images").del(); // child of press_releases
  await knex("press_releases").del(); // child of users
  await knex("users").del(); // parent

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  await knex("users").insert([
    {
      id: generateUniqueId(),
      name: "Super Admin",
      email: "superadmin@example.com",
      password: hashedPassword,
      role_id: 1, // Super Admin
    },
  ]);
};
