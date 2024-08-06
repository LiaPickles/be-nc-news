const { selectUsers, selectSingleUser } = require("../models/users.model");

const getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    return res.status(200).send({users});
  });
};

const getSingleUser = (req, res, next) => {
  const username = req.params.username
  selectSingleUser(username).then((user) => {
    return res.status(200).send({user})
  })
  .catch((err) => {
    next(err)
  })
}

module.exports = { getUsers, getSingleUser };
