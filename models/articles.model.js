const db = require("../db/connection");

const selectArticlesById = (articleId) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [articleId])
    .then((result) => {
      if (!result.rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return result.rows[0];
    });
};

module.exports = { selectArticlesById };
