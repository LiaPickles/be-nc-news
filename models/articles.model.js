const db = require("../db/connection");

const selectArticles = (
  topicQuery,
  sortBy = "created_at",
  orderBy = "DESC"
) => {
  orderBy = orderBy.toUpperCase();

  if (
    ![
      "author",
      "title",
      "article_id",
      "topic",
      "created_at",
      "votes",
      "article_img_url",
      "comment_count",
    ].includes(sortBy)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["ASC", "DESC"].includes(orderBy)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let queryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url,
  COUNT(comments.comment_id) AS comment_count
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryValues = [];

  if (topicQuery !== undefined) {
    topicQuery = topicQuery.toLowerCase();
    queryString += ` WHERE articles.topic = $1`;
    queryValues.push(topicQuery);
  }

  queryString += ` GROUP BY articles.article_id
  ORDER BY ${sortBy} ${orderBy}`;

  return db.query(queryString, queryValues).then((result) => {
    return result.rows;
  });
};

const selectArticlesById = (articleId) => {
  return db
    .query(
      `SELECT articles.*,
      COUNT (comments.comment_id) AS comment_count
      FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id`,
      [articleId]
    )
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

const updateArticleVotes = (newVotes, articleId) => {
  return db
    .query(
      `UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *`,
      [newVotes, articleId]
    )
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

const addNewArticle = (title, topic, author, body) => {
  return db
    .query(
      `INSERT INTO articles (title, topic, author, body)
    VALUES ($1, $2, $3, $4)
    RETURNING *`,
      [title, topic, author, body]
    )
    .then(({ rows }) => {
      return rows[0].article_id;
    });
};

module.exports = {
  selectArticles,
  selectArticlesById,
  updateArticleVotes,
  addNewArticle,
};
