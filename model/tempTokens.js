const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
  },
  createAt: { type: Date, default: Date.now() },
});

const Token = mongoose.model("tokens", tokenSchema);
module.exports = Token;
