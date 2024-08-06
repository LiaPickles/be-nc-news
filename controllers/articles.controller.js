const { sort } = require("../db/data/test-data/articles");
const {
  selectArticles,
  checkTopicExists,
  selectArticlesById,
  selectArticleComments,
  checkUserExists,
  createComment,
  updateArticleVotes,
  addNewArticle,
} = require("../models/articles.model");
const { selectSingleUser } = require("../models/users.model");

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

const getArticleComments = (req, res, next) => {
  const articleId = req.params.article_id;
  const promises = [selectArticleComments(articleId)];
  {
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
  if (commentBody) {
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
    res.status(400).send({ msg: "No comment given" });
  }
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
  getArticleComments,
  postArticleComment,
  patchArticleVotes,
  postArticle,
};
