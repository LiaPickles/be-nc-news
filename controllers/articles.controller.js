const {
  selectArticles,
  selectArticlesById,
} = require("../models/articles.model");

const getArticles = (req, res, next) => {
  selectArticles().then((articles) => {
    return res.status(200).send({ articles });
  });
};

const getArticlesById = (req, res, next) => {
  const articleId = req.params.article_id;
  selectArticlesById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticles, getArticlesById };
