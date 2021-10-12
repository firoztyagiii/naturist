exports.getIndex = async (req, res, next) => {
  res.render("index");
};
exports.getLogin = (req, res, next) => {
  res.render("login");
};
exports.getSignUp = (req, res, next) => {
  res.render("signup");
};
