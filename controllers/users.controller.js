const { selectUsers } = require("../models/users.model");

const getUsers = (req, res, next) => {
  selectUsers().then((users) => {
    return res.status(200).send({users});
  });
};

module.exports = { getUsers };
