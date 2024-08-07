const cors = require("cors");
const { getTopics } = require("./controllers/topics.controller");
const { getEndpointData } = require("./controllers/api.controller");
const {
  getArticles,
  getArticlesById,
  patchArticleVotes,
  postArticle,
} = require("./controllers/articles.controller");
const {
  getArticleComments,
  postArticleComment,
  deleteCommentById,
  patchCommentVotes,
} = require("./controllers/comments.controller");
const { getUsers, getSingleUser } = require("./controllers/users.controller");

const express = require("express");
const app = express();
app.use(cors());

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpointData);

app.get("/api/articles", getArticles);

app.post("/api/articles", postArticle);

app.get("/api/articles/:article_id", getArticlesById);

app.get("/api/articles/:article_id/comments", getArticleComments);

app.post("/api/articles/:article_id/comments", postArticleComment);

app.patch("/api/articles/:article_id", patchArticleVotes);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.patch("/api/comments/:comment_id", patchCommentVotes);

app.get("/api/users", getUsers);

app.get("/api/users/:username", getSingleUser);

app.use((err, req, res, next) => {
  if (err.code) {
    if (err.code === "23503") {
      res.status(400).send({ msg: "Topic does not exist" });
    }
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Bad request" });
    } else {
      res.status(400).send({ msg: "Unknown database error" });
    }
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
