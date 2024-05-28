const { getTopics } = require("./controllers/topics.controller");
const { getEndpointData } = require("./controllers/api.controller");

const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpointData);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
