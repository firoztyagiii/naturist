const Model = require("../model/allModels");
const AppError = require("../utils/error");
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
const writeFile = require("../utils/writeFile");

exports.postSignup = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword)
      throw new AppError(400, "Name, email and passwords are required!");

    const isAlreadyExisted = await Model.User.findOne({ email: email });

    if (isAlreadyExisted) {
      throw new AppError(400, "Email already exists");
    }

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
      `<a href="${process.env.DOMAIN}/activate-account.html?verify=${hash}" target="_blank" >Verify</a>`
    );

    res.status(201).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        message: "A validation link is sent to your email address, Please verify it!",
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError(400, "Email and password are required");

    const user = await Model.User.findOne({ email }).select("+password");
    if (!user) throw new AppError(400, "Invalid credentials");

    const isPassSame = await user.checkPassword(password, user.password);

    if (!isPassSame) throw new AppError(400, "Invalid credentials");

    if (!user.active) throw new AppError(400, "Account is not active, Please activate your account first.");

    if (user.is2FAEnabled) {
      const hash = crypto.randomBytes(64).toString("hex");
      const encryptedHash = crypto.createHash("sha256").update(hash).digest();
      const OTP = Math.floor(1000 + Math.random() * 9000);

      user.OTP = OTP;
      user.twoFAToken = encryptedHash;
      user.twoFATokenExpires = Date.now() + 60 * 10 * 1000;
      user.save({ validateBeforeSave: false });

      sendMail(user.email, "2FA Login OTP!", `<p>${OTP}</p>`);

      return res.status(200).json({
        status: "success",
        message: "OTP sent to your email address",
        data: `${hash}`,
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWTKEY, {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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
          photo: user.profilePhoto,
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

    const encryptedToken = crypto.createHash("sha256").update(activationToken).digest();

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

    if (!email) throw new AppError(400, "Email is required in order to reset the password");

    const user = await Model.User.findOne({ email });

    if (!user) throw new AppError(400, "No user is found with this email address");

    const hash = crypto.randomBytes(64).toString("hex");
    const encryptedHash = crypto.createHash("sha256").update(hash).digest();

    user.passwordResetToken = encryptedHash;
    user.passwordResetTokenExpires = Date.now() + 60 * 10 * 1000;
    user.save({ validateBeforeSave: false });

    sendMail(user.email, "Reset your Password!", `<p> ${process.env.DOMAIN}/reset-password.html?token=${hash} </p>`);

    res.status(200).json({
      status: "success",
      message: "Email is sent for resetting the password",
    });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const resetToken = req.query.token;

    if (!resetToken) {
      throw new AppError(401, "Invalid token or expired!");
    }

    const encryptedHash = crypto.createHash("sha256").update(resetToken).digest();

    if (!req.body.password || !req.body.confirmPassword)
      throw new AppError(400, "Password and confirm password are required");

    if (req.body.password !== req.body.confirmPassword) {
      throw new AppError(400, "Passwords do not match");
    }

    const user = await Model.User.findOne({
      passwordResetToken: encryptedHash,
    });

    if (!user) throw new AppError(400, "Invalid link or expired");

    if (Date.now(user.passwordResetTokenExpires) < Date.now()) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;
      await user.save();
      throw new AppError(400, "Link expired or invalid");
    }
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

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
    const hash = req.query.token;
    const OTP = req.body.OTP;

    if (!hash) {
      throw new AppError(400, "Invalid token");
    }

    if (!OTP) {
      throw new AppError(400, "No OTP found");
    }

    const encryptedHash = crypto.createHash("sha256").update(hash).digest();

    const user = await Model.User.findOne({
      twoFAToken: encryptedHash,
    });

    if (!user) {
      throw new AppError(400, "Token expired!");
    }

    if (new Date(user.twoFATokenExpires).getTime() < Date.now()) {
      user.OTP = undefined;
      user.twoFAToken = undefined;
      user.twoFATokenExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError(400, "Link expired! Try again");
    }

    if (!user) throw new AppError(400, "Token does not belong to the user");

    if (user.OTP != OTP) throw new AppError(400, "Incorrect OTP");

    user.OTP = undefined;
    user.twoFAToken = undefined;
    user.twoFATokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    const token = jwt.sign({ _id: user._id }, process.env.JWTKEY, {
      expiresIn: "1h",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
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

exports.logout = (req, res, next) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  //add
  res.status(200).json({ status: "successs" });
};

exports.updateMePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      throw new AppError(400, "Current and new password are required!");
    }

    const user = await Model.User.findOne({ _id: req.user._id }).select("+password");

    const isPasswordSame = await user.checkPassword(currentPassword, user.password);

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
      throw new AppError(400, "Name is required to update the info");
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

    if (!email) {
      throw new AppError(400, "No email is found to be changed");
    }

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
          `You can only change email once in 15 days, Last changed at ${new Date(emailUpdatedAt).toString()}`
        );
      }
    }

    const OTP = Math.floor(1000 + Math.random() * 9000);
    const hash = crypto.randomBytes(64).toString("hex");
    const encryptedHash = crypto.createHash("sha256").update(hash).digest();

    user.upateEmailToken = encryptedHash;
    user.emailChangingOTP = OTP;
    user.updateEmailTokenExpires = Date.now() + 60 * 10 * 1000;
    user.emailToChange = email.trim().toLowerCase();
    await user.save({ validateBeforeSave: false });

    sendMail(email, "Update Email Address OTP", `${process.env.DOMAIN}/update-email.html?token=${hash}`);

    res.status(200).json({
      status: "success",
      message: "Confirmation email is sent to your new email address",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError(400, "Photo is required");
    }

    const name = `${req.file.originalname.split(".")[0]}-${Date.now().toString()}.${
      req.file.originalname.split(".")[1]
    }`;

    const lastName = slugify(name, {
      replacement: "-",
      lower: false,
      trim: true,
    });

    writeFile(req.file.buffer, lastName);

    const photo = `uploads/${finalName}`;
    console.log(photo);
    await Model.User.findOneAndUpdate(req.user._id, { profilePhoto: photo });
    res.status(201).json({
      status: "success",
      message: "Profile photo changed successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.enable2fa = async (req, res, next) => {
  try {
    const user = await Model.User.findOne({ _id: req.user._id });
    if (!user) {
      throw new AppError(400, "Invalid user");
    }
    user.is2FAEnabled = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "2FA is enabled now",
    });
  } catch (err) {
    next(err);
  }
};

exports.turnOff2Fa = async (req, res, next) => {
  try {
    const user = await Model.User.findOne({ _id: req.user._id });

    if (!user) {
      throw new AppError(400, "Invalid user");
    }
    user.is2FAEnabled = false;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      status: "success",
      message: "2FA has been turned off now",
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const token = req.query.token;

    if (!token) {
      throw new AppError(400, "Could not find any valid token");
    }

    const { OTP } = req.body;

    if (!OTP) {
      throw new AppError(400, "No OTP found!");
    }
    const encryptedHash = crypto.createHash("sha256").update(token).digest();

    const user = await Model.User.findOne({ upateEmailToken: encryptedHash });

    if (!user) {
      throw new AppError(400, "This token does not belong to the user!");
    }

    if (new Date(user.updateEmailTokenExpires).getTime() < Date.now()) {
      user.emailToChange = undefined;
      user.upateEmailToken = undefined;
      user.emailChangingOTP = undefined;
      user.updateEmailTokenExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError(400, "Token has been expired. It was only valid for 10 mins!");
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

// exports.topFive = async (req, res, next) => {
//   const data = await Model.Tour.aggregate([
//     {
//       $match: { price: { $gt: 1200 } },
//     },
//     { $project: { name: 1, price: 1, difficulty: 1 } },
//     {
//       $group: {
//         _id: "$difficulty",
//         totalItems: { $sum: 1 },
//         averagePrice: { $avg: "$price" },
//         averageGroupSize: { $avg: "$groupSize" },
//       },
//     },
//     { $sort: { totalItems: -1 } },
//   ]);
//   res.json({ data });
// };
