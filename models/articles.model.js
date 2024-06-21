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
  console.log(queryValues);

  if (topicQuery !== undefined) {
    topicQuery = topicQuery.toLowerCase();
    queryString += ` WHERE articles.topic = $1`;
    queryValues.push(topicQuery);
  }
  
  queryString += ` GROUP BY articles.article_id
  ORDER BY ${sortBy} ${orderBy}`;


  return db.query(queryString, queryValues).then((result) => {
    console.log(result.rows)
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

const checkUserExists = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
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
const selectArticleVotes = (articleId) => {
  return db
    .query(
      `SELECT votes FROM articles
  WHERE article_id = $1`,
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
const updateArticleVotes = (updatedVotes, articleId) => {
  return db
    .query(
      `UPDATE articles
      SET votes = $1
      WHERE article_id = $2
      RETURNING *`,
      [updatedVotes, articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = {
  selectArticles,
  selectArticlesById,
  selectArticleComments,
  checkUserExists,
  createComment,
  selectArticleVotes,
  updateArticleVotes,
};
