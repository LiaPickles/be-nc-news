const {
  selectArticles,
  selectArticlesById,
  selectArticleComments,
  checkUserExists,
  createComment,
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

module.exports = {
  getArticles,
  getArticlesById,
  getArticleComments,
  postArticleComment,
};
