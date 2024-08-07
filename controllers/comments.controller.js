const {
  selectArticleComments,
  createComment,
  removeCommentById,
  updateCommentVotes,
} = require("../models/comments.model");
const { selectArticlesById } = require("../models/articles.model");
const { selectSingleUser } = require("../models/users.model");

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
    selectSingleUser(username)
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

const deleteCommentById = (req, res, next) => {
  const commentId = req.params.comment_id;
  removeCommentById(commentId)
    .then((result) => {
      return res.status(204).send({});
    })
    .catch((err) => {
      next(err);
    });
};

const patchCommentVotes = (req, res, next) => {
  const newCommentVotes = req.body.inc_votes;
  const commentId = req.params.comment_id;
  updateCommentVotes(newCommentVotes, commentId)
    .then((updatedComment) => {
      return res.status(200).send({ updatedComment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticleComments,
  postArticleComment,
  deleteCommentById,
  patchCommentVotes,
};
