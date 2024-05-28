const endpointData = require("../endpoints.json");

const getEndpointData = (req, res, next) => {
  return res.status(200).send({ endpointData });
};

module.exports = { getEndpointData };
