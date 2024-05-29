const db = require("../db/connection");

const selectArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT (comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at`
    )
    .then((result) => {
      return result.rows;
    });
};

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

module.exports = { selectArticles, selectArticlesById };
