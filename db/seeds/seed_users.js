const bcrypt = require("bcrypt");
const { generateUniqueId } = require("../../utils");

exports.seed = async function (knex) {
  // Deletes ALL existing users
  await knex("users").del();

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
