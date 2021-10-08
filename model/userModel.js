const mongoose = require("mongoose");

const bcrypt = require("bcryptjs");
const validator = require("validator");

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
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password should be atleast 6 characters long"],
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
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const encPass = await bcrypt.hash(this.password, 12);
  this.password = encPass;
  this.confirmPassword = undefined;
});

const User = mongoose.model("users", userSchema);

module.exports = User;
