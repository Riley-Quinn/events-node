// seeds/20250716_seed_task_status.js

exports.seed = async function (knex) {
  await knex("task_status").del();

  await knex("task_status").insert([
    { status_id: 1, status_name: "Open", status_type: "task" },
    { status_id: 2, status_name: "In Progress", status_type: "task" },
    { status_id: 3, status_name: "Pending", status_type: "task" },
    { status_id: 4, status_name: "On Hold", status_type: "task" },
    { status_id: 5, status_name: "Done", status_type: "task" },
    { status_id: 6, status_name: "Closed", status_type: "task" },
    { status_id: 7, status_name: "Draft", status_type: "press_release" },
    {
      status_id: 8,
      status_name: "Open for Review",
      status_type: "press_release",
    },
    {
      status_id: 9,
      status_name: "Ready to Publish",
      status_type: "press_release",
    },
    {
      status_id: 10,
      status_name: "Feedback Pending",
      status_type: "press_release",
    },
    { status_id: 11, status_name: "UnPublish", status_type: "press_release" },
    { status_id: 12, status_name: "Published", status_type: "press_release" },
  ]);
};
