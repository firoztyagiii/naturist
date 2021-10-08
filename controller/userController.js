const User = require("../model/userModel");
const AppError = require("../utils/error");

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
