const knex = require("../db");

const addComment = async (commentData) => {
  return await knex("tbl_comments").insert(commentData);
};
const getAllCommentsByModule = async (module, moduleId) => {
  try {
    if (module !== "task" && module !== "press_release") return [];

    const query = knex("tbl_comments")
      .leftJoin("users", "users.id", "tbl_comments.commented_by")
      .select(
        "tbl_comments.comment_id",
        "tbl_comments.comment",
        "tbl_comments.commented_by",
        "tbl_comments.created_at",
        "users.name as commented_username"
      )
      .where("tbl_comments.comments_module", module)
      .orderBy("tbl_comments.created_at", "desc");

    if (module === "task") {
      query.andWhere("tbl_comments.task_id", moduleId);
    } else if (module === "press_release") {
      query.andWhere("tbl_comments.press_id", moduleId);
    }
    return await query;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

const getCommentById = async (comment_id) => {
  return await knex("tbl_comments").where({ comment_id }).first();
};
module.exports = {
  addComment,
  getAllCommentsByModule,
  getCommentById,
};
