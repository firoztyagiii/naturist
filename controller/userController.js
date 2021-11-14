const jwt = require("jsonwebtoken");
const validator = require("validator");
const crypto = require("crypto");
const Cryptr = require("cryptr");

const sendMail = require("../utils/sendMail");
const Model = require("../model/allModels");
const AppError = require("../utils/error");
const emailTemplates = require("../utils/emailTemplates");

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

    const markup = emailTemplates.verification(hash);

    sendMail(user.email, "Activate your account!", markup);

    res.status(201).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        message: "A verification link is sent to your email address, Please verify it!",
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

      const markup = emailTemplates.emailOTP(OTP);

      sendMail(user.email, "Login OTP!", markup);

      return res.status(200).json({
        status: "success",
        message: "OTP sent to your email address",
        data: `${hash}`,
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWTKEY, {
      expiresIn: "1h",
    });

    const cookiesOption = {
      maxAge: 3600 * 1000,
      httpOnly: true,
      secure: false,
    };

    if (process.env.NODE_ENV === "production") {
      cookiesOption.secure = true;
      cookiesOption.sameSite = "none";
    }

    res.cookie("jwt", token, cookiesOption);

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

    const markup = emailTemplates.resetPassword(hash);

    sendMail(user.email, "Reset your Password!", markup);

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

    if (user.emailUpdatedAt) {
      const day = 60 * 60 * 24;
      const canChangeEmailOn = new Date(user.emailUpdatedAt).getTime() + 15 * day;
      if (new Date() < new Date(canChangeEmailOn)) {
        throw new AppError(
          400,
          `You can only change your email once in 15 days, Last changed at ${new Date(
            user.emailUpdatedAt
          ).toLocaleString("en-US")}`
        );
      }
    }

    const jwtToken = jwt.sign(
      { user: user._id.toString(), newEmail: email, expiresIn: Date.now() + 1000 * 60 * 10 },
      process.env.JWTKEY
    );

    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const encryptedHash = cryptr.encrypt(jwtToken);

    await Model.Token.create({ token: encryptedHash, createAt: Date.now() });

    const markup = emailTemplates.updateEmail(encryptedHash);

    sendMail(email, "Update Email Address", markup);

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
      throw new AppError(400, "Please select an image");
    }
    await Model.User.findOneAndUpdate(req.user._id, { profilePhoto: req.file.location });
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

    const isTokenAvailable = await Model.Token.findOne({ token });

    if (!isTokenAvailable) {
      throw new AppError(400, "Invalid token or expired");
    }

    const cryptr = new Cryptr(process.env.CRYPTR_KEY);
    const jwtToken = cryptr.decrypt(token);

    const tokenPayload = jwt.verify(jwtToken, process.env.JWTKEY);

    const user = await Model.User.findOne({ _id: tokenPayload.user });

    if (!user) {
      await Model.Token.findOneAndDelete({ token: token });
      throw new AppError(400, "Token does not belong to the user");
    }

    if (Date.now() > tokenPayload.expiresIn) {
      await Model.Token.findOneAndDelete({ token: token });
      throw new AppError(400, "Token has been expired. It was only valid for 10 mins!");
    }

    await Model.User.findOneAndUpdate(
      { _id: tokenPayload.user },
      { email: tokenPayload.newEmail, emailUpdatedAt: Date.now() }
    );

    await Model.Token.findOneAndDelete({ token: token });

    res.status(200).json({
      status: "success",
      message: "Email changed successfully!",
    });
  } catch (err) {
    next(err);
  }
};
