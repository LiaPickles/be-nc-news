const db = require("../db/connection");

const selectArticleComments = (articleId) => {
  return db
    .query(
      `SELECT comment_id,votes, created_at, author, body, article_id 
      FROM comments
      WHERE article_id = $1
      ORDER BY created_at DESC`,
      [articleId]
    )
    .then((result) => {
      return result.rows;
    });
};

const createComment = (articleId, commentObj) => {
  const { username, body } = commentObj;
  return db
    .query(
      `INSERT INTO comments (body, article_id, author)
      VALUES ($1, $2, $3)
      RETURNING body`,
      [body, articleId, username]
    )
    .then((result) => {
      return result.rows[0].body;
    });
};

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

module.exports = {
  selectArticleComments,
  createComment,
  removeCommentById,
  updateCommentVotes,
};
