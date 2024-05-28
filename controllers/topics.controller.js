const { selectTopics } = require("../models/topics.model");

const getTopics = (req, res, next) => {
  selectTopics().then((topicsArr) => {
    res.status(200).send({ topics: topicsArr });
  });
};

module.exports = { getTopics };
