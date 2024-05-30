const db = require("../db/connection");

const removeCommentById = (commentId) => {
  return db
    .query(
      `DELETE FROM comments WHERE comment_id =$1 RETURNING body`,
      [commentId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return rows;
    });
};

module.exports = { removeCommentById };
