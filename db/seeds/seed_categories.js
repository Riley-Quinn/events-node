exports.seed = async function (knex) {
  await knex("categories").del();

  await knex("categories").insert([
    { name: "Political Support" },
    { name: "School Maintenance" },
    { name: "Hospital Service" },
    { name: "Public Place" },
    { name: "Event Permissions" },
    { name: "Emergency Medical Support" },
    { name: "Educational Material Help" },
    { name: "Hospital Infrastructure" },
    { name: "Visiting Place Maintenance" },
    { name: "Political Appointment" },
    { name: "School Fee Assistance" },
    { name: "Health Camp Request" },
  ]);
};
