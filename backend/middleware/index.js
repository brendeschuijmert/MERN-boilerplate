const jwt = require("jsonwebtoken");
const { invalidToken, accessDenied } = require("../constants");

module.exports = (req, res, next) => {
  const header = req.headers["x-access-token"] || req.headers["authorization"];
  if (!header)
    return res
      .status(accessDenied.code)
      .send({ message: accessDenied.message });
  const token = header.split(" ");
  if (!token[1])
    return res
      .status(accessDenied.code)
      .send({ message: accessDenied.message });

  try {
    const decoded = jwt.verify(token[1], "secret");
    req.user = decoded;
    next();
  } catch (err) {
    res.status(invalidToken.code).send({ message: invalidToken.message });
  }
};
