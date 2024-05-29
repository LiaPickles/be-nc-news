const { getTopics } = require("./controllers/topics.controller");
const { getEndpointData } = require("./controllers/api.controller");
const { getArticles, getArticlesById } = require("./controllers/articles.controller");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpointData);

app.get("/api/articles", getArticles)

app.get("/api/articles/:article_id", getArticlesById);

app.use((err, req, res, next) => {
  if (err.code) {
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
