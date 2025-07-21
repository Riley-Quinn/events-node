const knex = require("../db");

const Role = {
  async getAll() {
    return knex("roles").select("*");
  },

  async create(name) {
    return knex("roles").insert({ name }).returning("*");
  },

  async update(roleId, data) {
    return knex("roles").where({ id: roleId }).update(data);
  },

  async delete(roleId) {
    return knex("roles").where({ id: roleId }).del();
  },

  async getPermissions(roleId) {
    return knex("role_permissions")
      .where("role_id", roleId)
      .join("permissions", "permissions.id", "role_permissions.permission_id")
      .select("permissions.id", "permissions.action", "permissions.subject");
  },

  async setPermissions(roleId, permissionIds) {
    await knex("role_permissions").where({ role_id: roleId }).del();

    if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
      return;
    }

    const rolePermissions = permissionIds.map((pid) => ({
      role_id: roleId,
      permission_id: pid,
    }));

    return knex("role_permissions").insert(rolePermissions);
  },
};

module.exports = Role;
