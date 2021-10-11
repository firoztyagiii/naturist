const Model = require("../model/allModels");
const AppError = require("../utils/error");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");

exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
      throw new AppError(400, "Invalid Input");

    const user = await Model.User.create({
      name,
      email,
      password,
      confirmPassword,
    });

    const hash = crypto.randomBytes(32).toString("hex");
    const encryptedHash = crypto.createHash("sha256").update(hash).digest();

    user.activationToken = encryptedHash;
    user.save({ validateBeforeSave: false });

    sendMail(
      user.email,
      "Activate your account!",
      `<p> /user/activate-account/${hash} </p>`
    );

    res.status(201).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        message:
          "An OTP is sent to your email address, Please activate your account",
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

    const user = await Model.User.findOne({ email }).select("+password");
    if (!user) throw new AppError(400, "Invalid credentials");
    if (!user.active)
      throw new AppError(
        400,
        "Account is not active, Please activate your account first."
      );

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

exports.aboutMe = async (req, res, next) => {
  try {
    const user = await Model.User.findOne({ _id: req.user._id });
    res.status(200).json({
      status: "success",
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.activateAccount = async (req, res, next) => {
  try {
    const activationToken = req.params.activationToken;
    if (!activationToken) throw new AppError(400, "Invalid token or expired");
    const encryptedToken = crypto
      .createHash("sha256")
      .update(activationToken)
      .digest();

    const user = await Model.User.findOne({ activationToken: encryptedToken });
    if (!user) throw new AppError(400, "Token expired or invalid");
    user.active = true;
    user.activationToken = undefined;
    user.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      message: "Account verified successfully",
    });
  } catch (err) {
    next(err);
  }
};
