const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const AppError = require("../utils/error");

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (!req.cookies.jwt && !req.headers.authorization)
      throw new AppError(400, "You are not logged in!");

    let token;

    const cookie = req.cookies.jwt;

    if (cookie) {
      token = cookie;
    } else {
      const authToken = req.headers.authorization.split(" ")[1];
      token = authToken;
    }

    const payload = jwt.verify(token, process.env.JWTKEY);
    const user = await User.findOne({ _id: payload._id });
    if (!user)
      throw new AppError(
        400,
        "Invalid or cookie has been expired, Please login again!"
      );
    const isExpired = user.isCookieExpired(payload.exp);
    if (isExpired) {
      throw new AppError(400, "Cookie has been expired");
    }
    if (user.passwordChangedAt) {
      if (Date.now(user.passwordChangedAt) / 1000 < payload.iat) {
        throw new AppError(400, "Token has been expired, Please log in again");
      }
    }
    req.user = {
      _id: user._id,
      name: user.name,
    };
    next();
  } catch (err) {
    next(err);
  }
};
