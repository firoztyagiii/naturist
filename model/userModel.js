const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    validate: {
      validator: function (value) {
        validator.isEmail(value);
      },
      message: "Invalid email address",
    },
    unique: [true],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password should be atleast 6 characters long"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return value === this.password;
      },
      message: "Confirm password does not match",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  role: {
    type: String,
    enum: ["user", "guide", "admin"],
    default: "user",
  },
  active: {
    type: Boolean,
    default: false,
  },
  profilePhoto: { type: String, default: "uploads/default-img.png" },
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
  activationToken: {
    type: String,
  },
  is2FAEnabled: {
    type: Boolean,
    default: false,
  },
  twoFAToken: String,
  twoFATokenExpires: Date,
  passwordChangedAt: Date,
  OTP: Number,
  updateEmailToken: String,
  updateEmailTokenExpires: Date,
  emailUpdatedAt: Date,
  emailChangingOTP: Number,
  emailToChange: String,
  bookmark: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tours",
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const encPass = await bcrypt.hash(this.password, 12);
  this.password = encPass;
  this.confirmPassword = undefined;
  this.passwordResetToken = undefined;
  this.passwordResetTokenExpires = undefined;
});

userSchema.methods.checkPassword = async function (inputPassword, DBPassword) {
  return await bcrypt.compare(inputPassword, DBPassword);
};

userSchema.methods.isCookieExpired = function (expireTime) {
  return Date.now() / 1000 > expireTime;
};

const User = mongoose.model("users", userSchema);

module.exports = User;
