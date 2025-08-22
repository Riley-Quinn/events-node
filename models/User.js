const knex = require("../db");

const User = {
  async findByEmail(email) {
    return knex("users").where({ email }).first();
  },

  async create(user) {
    return knex("users").insert(user);
  },

  async getPermissions(userId) {
    return knex("permissions")
      .join(
        "role_permissions",
        "permissions.id",
        "role_permissions.permission_id"
      )
      .join("roles", "roles.id", "role_permissions.role_id")
      .join("users", "users.role_id", "roles.id")
      .where("users.id", userId)
      .select("permissions.action", "permissions.subject");
  },

  async getAllUsers() {
    return knex("users")
      .join("roles", "users.role_id", "roles.id")
      .select("users.*", "roles.name as role_name");
  },

  async getUserById(id) {
    return knex("users")
      .join("roles", "users.role_id", "roles.id")
      .select("users.*", "roles.name as role_name")
      .where("users.id", id)
      .first();
  },

  async updateUser(id, data) {
    const { name, email, role_id, phone, address, is_active } = data;
    return knex("users").where({ id }).update({
      name,
      email,
      role_id,
      phone,
      address,
      is_active,
      updated_at: knex.fn.now(),
    });
  },

  async deleteUser(id) {
    return knex("users").where({ id }).del();
  },

  async updatePassword(id, hashedPassword) {
    return knex("users").where({ id }).update({
      password: hashedPassword,
      updated_at: knex.fn.now(),
    });
  },
};

module.exports = User;
