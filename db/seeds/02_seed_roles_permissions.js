exports.seed = async function (knex) {
  // Clear existing data
  await knex("tbl_comments").del();
  await knex("tasks").del();

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
    { id: 9, action: "add", subject: "Task" },
    { id: 10, action: "delete", subject: "Task" },
    { id: 11, action: "view", subject: "Task" },
    { id: 12, action: "add", subject: "PressRelease" },
    { id: 13, action: "delete", subject: "PressRelease" },
    { id: 14, action: "view", subject: "PressRelease" },
    { id: 15, action: "add", subject: "Birthday" },
    { id: 16, action: "delete", subject: "Birthday" },
    { id: 17, action: "view", subject: "Birthday" },
    { id: 18, action: "add", subject: "ImportantDays" },
    { id: 19, action: "delete", subject: "ImportantDays" },
    { id: 20, action: "view", subject: "ImportantDays" },
  ];
  await knex("permissions").insert(permissions);

  // Assign Permissions to Roles
  const rolePermissions = [];

  // Super Admin gets everything
  for (let i = 1; i <= 20; i++) {
    rolePermissions.push({ role_id: 1, permission_id: i });
  }

  // Org Admin gets all except modify global permissions
  for (let i = 1; i <= 20; i++) {
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
