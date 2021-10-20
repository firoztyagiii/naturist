const Model = require("../model/allModels");
const AppError = require("../utils/error");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const validator = require("validator");
const jwt = require("jsonwebtoken");

exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
      throw new AppError(
        400,
        "Name, email, password and confirm password fields are required!"
      );

    const isAlreadyExisted = await Model.User.findOne({ email: email });

    if (isAlreadyExisted) {
      throw new AppError("400", "Email already exists");
    }

    const user = await Model.User.create({
      name,
      email,
      password,
      confirmPassword,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWTKEY);

    user.activationToken = token;
    user.save({ validateBeforeSave: false });

    sendMail(
      user.email,
      "Activate your account!",
      `<a href="${process.env.DOMAIN}/activate-account.html?verify=${token}" target="_blank" >Verify Account</a>`
    );

    res.status(201).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        message: "Verify your email address!",
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

    // if (user.is2FAEnabled) {
    //   const hash = crypto.randomBytes(32).toString("hex");
    //   const encryptedHash = crypto.createHash("sha256").update(hash).digest();
    //   const OTP = Math.floor(1000 + Math.random() * 9000);
    //   user.OTP = OTP;
    //   user.twoFAToken = encryptedHash;
    //   user.save({ validateBeforeSave: false });
    //   sendMail(
    //     user.email,
    //     "Reset your Password!",
    //     `
    //    <p> ${process.env.DOMAIN}/user/2fa/${hash} </p>
    //   <p>${OTP}</p>`
    //   );
    //   return res.status(200).json({
    //     message: "OTP sent to your email address",
    //   });
    // }

    const token = jwt.sign({ _id: user._id }, process.env.JWTKEY, {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: false,
      maxAge: 3600 * 1000,
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
    const activationToken = req.query.verify;
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

    const token = jwt.sign({ _id: user._id }, process.env.JWTKEY, {
      expiresIn: "10m",
    });

    // user.passwordResetToken = tok;
    // user.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
    // user.save({ validateBeforeSave: false });

    sendMail(
      user.email,
      "Reset your Password!",
      `<p>${process.env.DOMAIN}/reset-password.html?token=${token}</p>`
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
    const token = req.query.token;

    if (!token) {
      throw new AppError(401, "Invalid token or expired");
    }

    // const encryptedHash = crypto
    //   .createHash("sha256")
    //   .update(resetToken)
    //   .digest();

    if (!req.body.password || !req.body.confirmPassword)
      throw new AppError(
        400,
        "Password and confirmation passwords are required"
      );

    const payload = jwt.verify(token, process.env.JWTKEY);

    if (Date.now() / 1000 > payload.exp) {
      throw new AppError(400, "Link expired, Please try again!");
    }

    const user = await Model.User.findOne({ _id: payload._id });

    console.log(user);

    // if (!user) throw new AppError(400, "Invalid link or expired");
    // if (Date.parse(user.passwordResetTokenExpires) < Date.now()) {
    //   user.save({ validateBeforeSave: false });
    //   throw new AppError(400, "Link expired or invalid");
    // }
    // user.passwordResetToken = undefined;
    // user.passwordResetTokenExpires = undefined;
    // user.password = req.body.password;
    // user.confirmPassword = req.body.confirmPassword;
    // user.passwordChangedAt = Date.now();
    // user.save();
    // res.status(200).json({
    //   status: "success",
    //   message: "Password changed",
    // });
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
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: false,
    // sameSite: "none",
  });

  res.status(200).json({ status: "successs" });
};

exports.updateMePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      throw new AppError(400, "Invalid inputs");
    }
    const user = await Model.User.findOne({ _id: req.user._id }).select(
      "+password"
    );
    const isPasswordSame = await user.checkPassword(
      currentPassword,
      user.password
    );
    if (!isPasswordSame) {
      throw new AppError(401, "Incorrect password");
    }
    user.password = newPassword;
    user.confirmPassword = confirmNewPassword;
    user.passwordChangedAt = Date.now();
    await user.save();
    res.status(201).json({
      status: "success",
      message: "Password changed successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMeInfo = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      throw new AppError(400, "Name or email is required to update the info");
    }
    const user = await Model.User.findOne({ _id: req.user._id });
    user.name = name;
    await user.save({ validateBeforeSave: false });
    res.status(201).json({
      status: "success",
      message: "Info changed successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMeEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!validator.isEmail(email)) {
      throw new AppError(400, "Invalid email address");
    }

    const existedUser = await Model.User.findOne({ email });

    if (existedUser) {
      throw new AppError(400, "Email already in use!");
    }

    const user = await Model.User.findOne({ _id: req.user._id });
    const emailUpdatedAt = user.emailUpdatedAt;

    const day = 60 * 60 * 24;

    if (emailUpdatedAt) {
      const canChangeEmailOn = new Date(emailUpdatedAt).getTime() + 15 * day;
      if (new Date() < new Date(canChangeEmailOn)) {
        throw new AppError(
          400,
          `You can only change email once in 15 days, Last changed at ${new Date(
            emailUpdatedAt
          ).toString()}`
        );
      }
    }
    const OTP = Math.floor(1000 + Math.random() * 9000);
    const hash = crypto.randomBytes(64).toString("hex");
    const encryptedHash = crypto.createHash("sha256").update(hash).digest();
    user.upateEmailToken = encryptedHash;
    user.emailChangingOTP = OTP;
    user.updateEmailTokenExpires = Date.now() + 1000 * 600;
    user.emailToChange = email.trim().toLowerCase();
    await user.save({ validateBeforeSave: false });
    sendMail(
      email,
      "Update Email Address OTP",
      `${process.env.DOMAIN}/update-email?token=${hash}
      and the OTP is ${OTP}`
    );
    res.status(201).json({
      status: "success",
      message: "OTP sent to the new email address",
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.query.token;
    const { OTP } = req.body;
    if (!token) {
      throw new AppError(403, "Invalid token or expired!");
    }
    if (!OTP) {
      throw new AppError(400, "No OTP found!");
    }
    const encryptedHash = crypto.createHash("sha256").update(token).digest();
    const user = await Model.User.findOne({ upateEmailToken: encryptedHash });
    if (new Date(user.updateEmailTokenExpires).getTime() < Date.now()) {
      throw new AppError(
        400,
        "Token has been expired. It was only valid for 10 mins!"
      );
    }
    if (OTP != user.emailChangingOTP) {
      throw new AppError(400, "Wrong OTP");
    }
    const changeTo = user.emailToChange;
    user.email = changeTo;
    user.emailToChange = undefined;
    user.upateEmailToken = undefined;
    user.emailChangingOTP = undefined;
    user.updateEmailTokenExpires = undefined;
    user.emailUpdatedAt = Date.now();
    await user.save({ validateBeforeSave: false });
    res.status(201).json({
      status: "success",
      message: "Email changed successfully!",
    });
  } catch (err) {
    next(err);
  }
};
