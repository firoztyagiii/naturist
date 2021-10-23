const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const AppError = require("../utils/error");

exports.isLoggedIn = async (req, res, next) => {
  try {
    if (!req.cookies.jwt && !req.headers.authorization) throw new AppError(400, "You are not logged in!");

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

    if (!user) throw new AppError(400, "Invalid or cookie has been expired, Please login again!");

    const isExpired = user.isCookieExpired(payload.exp);

    if (isExpired) {
      throw new AppError(400, "Cookie expired");
    }

    if (user.passwordChangedAt) {
      if (new Date(user.passwordChangedAt) > new Date(payload.iat * 1000)) {
        throw new AppError(400, "Token has been expired, Please log in again");
      }
    }

    if (user.emailUpdatedAt) {
      if (new Date(user.emailUpdatedAt) > new Date(payload.iat * 1000)) {
        throw new AppError(400, "Token has been expired, Please log in again");
      }
    }

    req.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    next();
  } catch (err) {
    next(err);
  }
};
