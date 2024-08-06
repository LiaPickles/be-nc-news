const db = require("../db/connection");

const removeCommentById = (commentId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id =$1 RETURNING body`, [
      commentId,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
      return rows;
    });
};

const updateCommentVotes = (newCommentVotes, commentId) => {
  return db
    .query(
      `UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`,
      [newCommentVotes, commentId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Comment not found",
        });
      }
      return rows[0];
    });
};

module.exports = { removeCommentById, updateCommentVotes };
