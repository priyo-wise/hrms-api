const sessions = require("../service/session");

const authorize = (req, res, next) => {
  if ((sessions.getLoggedUser(req) || null) == null) {
    res.status(401).json();
  } else next();
};

module.exports = {
  authorize,
};
