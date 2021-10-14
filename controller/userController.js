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

    const isPassSame = await user.checkPassword(password, user.password);

    if (!isPassSame) throw new AppError(400, "Invalid credentials");

    if (!user.active)
      throw new AppError(
        400,
        "Account is not active, Please activate your account first."
      );

    if (user.is2FAEnabled) {
      const hash = crypto.randomBytes(32).toString("hex");
      const encryptedHash = crypto.createHash("sha256").update(hash).digest();
      const OTP = Math.floor(1000 + Math.random() * 9000);
      user.OTP = OTP;
      user.twoFAToken = encryptedHash;
      user.save({ validateBeforeSave: false });
      sendMail(
        user.email,
        "Reset your Password!",
        `
       <p> ${process.env.DOMAIN}/user/2fa/${hash} </p> 
      <p>${OTP}</p>`
      );
      return res.status(200).json({
        message: "OTP sent to your email address",
      });
    }

    const token = user.generateJWTToken({ _id: user._id });
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
    });
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

exports.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    if (!email)
      throw new AppError(
        400,
        "Email is required in order to reset the password"
      );
    const user = await Model.User.findOne({ email });
    if (!user)
      throw new AppError(400, "No user is found with this email address");
    const hash = crypto.randomBytes(64).toString("hex");
    const encryptedHash = crypto.createHash("sha256").update(hash).digest();
    user.passwordResetToken = encryptedHash;
    user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    user.save({ validateBeforeSave: false });
    sendMail(
      user.email,
      "Reset your Password!",
      `<p> /user/reset-password/${hash} </p>`
    );
    res.status(200).json({
      status: "success",
      message: "Email for resetting the password has been sent",
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetToken = req.params.resetToken;
    const encryptedHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest();

    if (!req.body.password || !req.body.confirmPassword)
      throw new AppError(400, "Password and confirm password are required");
    const user = await Model.User.findOne({
      passwordResetToken: encryptedHash,
    });
    if (!user) throw new AppError(400, "Link expired or invalid");
    if (Date.parse(user.passwordResetTokenExpires) < Date.now()) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      user.save({ validateBeforeSave: false });
      throw new AppError(400, "Link expired or invalidd");
    }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordChangedAt = Date.now();
    user.save();
    res.status(200).json({
      status: "success",
      message: "Password changed",
    });
  } catch (err) {
    next(err);
  }
};

exports.twoFA = async (req, res, next) => {
  try {
    const twoFAToken = req.params.token;
    const encryptedHash = crypto
      .createHash("sha256")
      .update(twoFAToken)
      .digest();

    const OTP = req.body.otp;
    const user = await Model.User.findOne({
      twoFAToken: encryptedHash,
    });
    if (!user) throw new AppError(400, "Invalid 2FA token/URL");
    if (user.OTP != OTP) throw new AppError(400, "Incorrect OTP");
    user.OTP = undefined;
    user.save({ validateBeforeSave: false });
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

exports.logout = (req, res, next) => {
  res.cookie("jwt", "");
  res.status(301).json({});
};
