const { removeCommentById } = require("../models/comments.model");

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

module.exports = { deleteCommentById };
