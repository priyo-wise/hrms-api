const setSession = (req, key, value) => {
  req.session[key] = value;
};
const getSession = (req, key) => {
  return req.session[key];
};
const setLoggedUser = (req, userId) => {
  setSession(req, "UserId", userId);
};
const getLoggedUser = (req) => {
  return getSession(req, "UserId");
};
const clear = (req) => {
  req.session.destroy();
};

module.exports = {
  setLoggedUser,
  getLoggedUser,
  clear
};
