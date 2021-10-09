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
    // TODO: //check if the password is changed after issuing the token
    console.log("You are logged In");
    next();
  } catch (err) {
    next(err);
  }
};
