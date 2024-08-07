const db = require("../db/connection");

const selectTopics = () => {
  return db.query("SELECT * FROM topics").then((result) => {
    return result.rows;
  });
};

const checkTopicExists = (topic) => {
  return db
    .query(
      `SELECT * FROM topics
    WHERE slug = $1`,
      [topic]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({
          status: 404,
          msg: "Topic not found",
        });
      }
      return rows[0];
    });
};

module.exports = { selectTopics, checkTopicExists };
