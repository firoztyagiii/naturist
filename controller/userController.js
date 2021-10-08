const User = require("../model/userModel");

exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid input",
      });
    }
    const user = await User.create({ name, email, password, confirmPassword });

    res.status(201).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
