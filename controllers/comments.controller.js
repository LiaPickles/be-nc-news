const { removeCommentById, updateCommentVotes } = require("../models/comments.model");

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

module.exports = { deleteCommentById, patchCommentVotes };
