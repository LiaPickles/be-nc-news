const {
  selectArticles,
  selectArticlesById,
  selectArticleComments,
  checkUserExists,
  createComment,
  selectArticleVotes,
  updateArticleVotes,
} = require("../models/articles.model");

const getArticles = (req, res, next) => {
  const topicQuery = req.query.topics;
  selectArticles(topicQuery)
    .then((articles) => {
      if (!articles.length) {
        return res.status(404).send({ msg: "Topic not found" });
      } else {
        return res.status(200).send({ articles });
      }
    })
    .catch((err) => {
      next(err);
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

const getArticleComments = (req, res, next) => {
  const articleId = req.params.article_id;
  const promises = [selectArticleComments(articleId)];
  if (articleId) {
    promises.push(selectArticlesById(articleId));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      res.status(200).send({ comments: resolvedPromises[0] });
    })
    .catch((err) => {
      next(err);
    });
};

const postArticleComment = (req, res, next) => {
  const articleId = req.params.article_id;
  const username = req.body.username;
  const commentObj = req.body;
  const commentBody = req.body.body;
  if (username && commentBody) {
    checkUserExists(username)
      .then(() => {
        return selectArticlesById(articleId);
      })
      .then(() => {
        return createComment(articleId, commentObj);
      })
      .then((comment) => {
        return res.status(201).send({ comment });
      })
      .catch((err) => {
        next(err);
      });
  } else {
    res.status(400).send({ msg: "Incorrect username or no comment" });
  }
};

const patchArticleVotes = (req, res, next) => {
  const articleId = req.params.article_id;
  const newVotes = req.body.inc_votes;
  selectArticleVotes(articleId)
    .then((votes) => {
      const oldVotes = votes.votes;
      return oldVotes + newVotes;
    })
    .then((updatedVotes) => {
      return updateArticleVotes(updatedVotes, articleId);
    })
    .then((article) => {
      return res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticles,
  getArticlesById,
  getArticleComments,
  postArticleComment,
  patchArticleVotes,
};
