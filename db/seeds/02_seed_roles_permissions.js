exports.seed = async function (knex) {
  // Clear existing data
  await knex("role_permissions").del();
  await knex("permissions").del();
  await knex("roles").del();

  // Insert Roles
  const roles = [
    { id: 1, name: "Super Admin" },
    { id: 2, name: "Org Admin" },
    { id: 3, name: "Event Manager" },
    { id: 4, name: "Media Contributor" },
    { id: 5, name: "Field Volunteer" },
    { id: 6, name: "Public Viewer" },
  ];
  await knex("roles").insert(roles);

  // Insert Permissions
  const permissions = [
    { id: 1, action: "view", subject: "Event" },
    { id: 2, action: "add", subject: "Event" },
    { id: 3, action: "delete", subject: "Event" },
    { id: 4, action: "view", subject: "Media" },
    { id: 5, action: "add", subject: "Media" },
    { id: 6, action: "delete", subject: "Media" },
    { id: 7, action: "manage", subject: "User" },
    { id: 8, action: "modify", subject: "Permission" },
  ];
  await knex("permissions").insert(permissions);

  // Assign Permissions to Roles
  const rolePermissions = [];

  // Super Admin gets everything
  for (let i = 1; i <= 8; i++) {
    rolePermissions.push({ role_id: 1, permission_id: i });
  }

  // Org Admin gets all except modify global permissions
  for (let i = 1; i <= 8; i++) {
    rolePermissions.push({ role_id: 2, permission_id: i });
  }

  // Event Manager gets: view/add/delete Event, view/add/delete Media
  [1, 2, 3, 4, 5, 6].forEach((pid) =>
    rolePermissions.push({ role_id: 3, permission_id: pid })
  );

  // Media Contributor: view/add/delete Media
  [4, 5, 6].forEach((pid) =>
    rolePermissions.push({ role_id: 4, permission_id: pid })
  );

  // Field Volunteer: only view Media
  [1, 4].forEach((pid) =>
    rolePermissions.push({ role_id: 5, permission_id: pid })
  );

  // Public Viewer: only view Media
  rolePermissions.push({ role_id: 6, permission_id: 4 });

  // Insert into role_permissions
  await knex("role_permissions").insert(rolePermissions);
};
