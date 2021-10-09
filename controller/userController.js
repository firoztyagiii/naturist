const User = require("../model/userModel");
const AppError = require("../utils/error");
const jwt = require("jsonwebtoken");

exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
      throw new AppError(400, "Invalid Input");

    const user = await User.create({ name, email, password, confirmPassword });

    res.status(201).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new AppError(400, "Email and password are required");

    const user = await User.findOne({ email }).select("password");
    if (!user) throw new AppError(400, "Invalid credentials");

    const isPassSame = await user.checkPassword(password, user.password);

    if (!isPassSame) throw new AppError(400, "Invalid credentials");

    const token = user.generateJWTToken({ _id: user._id });
    res.cookie("jwt", token);
    res.status(200).json({
      status: "success",
      token: token,
    });
  } catch (err) {
    next(err);
  }
};
