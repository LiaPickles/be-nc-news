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
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Not found",
        });
      }
      return rows[0];
    });
};

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

module.exports = { selectArticles, selectArticlesById, selectArticleComments };
