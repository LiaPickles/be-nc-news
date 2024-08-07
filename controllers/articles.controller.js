const { sort } = require("../db/data/test-data/articles");
const {
  selectArticles,
  selectArticlesById,
  updateArticleVotes,
  addNewArticle,
} = require("../models/articles.model");
const { selectSingleUser } = require("../models/users.model");
const { checkTopicExists } = require("../models/topics.model");

const getArticles = (req, res, next) => {
  const topicQuery = req.query.topics;
  const sortBy = req.query.sort_by;
  const orderBy = req.query.order;

  if (topicQuery) {
    checkTopicExists(topicQuery)
      .then((topics) => {
        return selectArticles(topicQuery, sortBy, orderBy);
      })
      .then((articles) => {
        if (articles.length === 0) {
          return res
            .status(200)
            .send({ msg: "No articles found for this topic" });
        }
        return res.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    selectArticles(topicQuery, sortBy, orderBy)
      .then((articles) => {
        return res.status(200).send({ articles });
      })
      .catch((err) => {
        next(err);
      });
  }
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

const patchArticleVotes = (req, res, next) => {
  const articleId = req.params.article_id;
  const newVotes = req.body.inc_votes;
  updateArticleVotes(newVotes, articleId)
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const postArticle = (req, res, next) => {
  const { title, topic, author, body } = req.body;

  if (!title || !topic || !author || !body) {
    return res.status(400).send({ msg: "Missing article field" });
  }

  selectSingleUser(author)
    .then((user) => {
      return addNewArticle(title, topic, author, body);
    })
    .then((article_id) => {
      return selectArticlesById(article_id);
    })
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticles,
  getArticlesById,
  patchArticleVotes,
  postArticle,
};
