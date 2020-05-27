const {
  unauthorized: { message, code }
} = require("../constants");

function hasRole(roles) {
  return (req, res, next) => {
    if (roles.indexOf(req.user.role) > -1) {
      next();
      return;
    }

    res.status(code).json({ message });
  };
}

module.exports = {
  hasRole
};
