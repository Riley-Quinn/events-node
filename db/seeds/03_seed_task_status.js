// seeds/20250716_seed_task_status.js

exports.seed = async function (knex) {
  await knex("task_status").del();

  await knex("task_status").insert([
    { status_name: "Open" },
    { status_name: "In Progress" },
    { status_name: "Pending" },
    { status_name: "On Hold" },
    { status_name: "Done" },
    { status_name: "Closed" },
  ]);
};
