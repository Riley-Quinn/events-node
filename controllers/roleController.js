const Role = require("../models/Role");

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.getAll();
    res.json(roles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch roles" });
  }
};

exports.createRole = async (req, res) => {
  const { name } = req.body;

  try {
    const [newRole] = await Role.create(name);
    res.json({ message: "Role created", role: newRole });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create role" });
  }
};

exports.deleteRole = async (req, res) => {
  const { roleId } = req.params;

  try {
    await Role.delete(roleId);
    res.json({ message: "Role deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete role" });
  }
};

exports.updateRole = async (req, res) => {
  const { roleId } = req.params;
  const { name, is_active } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (is_active !== undefined) updateData.is_active = is_active;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "No data to update" });
  }

  try {
    await Role.update(roleId, updateData);
    res.json({ message: "Role updated", updatedFields: updateData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update role" });
  }
};

exports.getRolePermissions = async (req, res) => {
  const { roleId } = req.params;

  try {
    const permissions = await Role.getPermissions(roleId);
    res.json(permissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch role permissions" });
  }
};

exports.updateRolePermissions = async (req, res) => {
  const { roleId } = req.params;
  const { permissionIds } = req.body;

  try {
    await Role.setPermissions(roleId, permissionIds);
    res.json({ message: "Permissions updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update permissions" });
  }
};
