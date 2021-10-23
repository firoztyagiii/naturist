const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tours",
  },
  paid: {
    type: Boolean,
    default: true,
  },
  price: {
    type: Number,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name",
  }).populate("tour");
  next();
});

const Booking = mongoose.model("bookings", bookingSchema);

module.exports = Booking;
