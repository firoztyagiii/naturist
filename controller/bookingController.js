const Model = require("../model/allModels");

exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Model.Booking.find({ user: req.user._id });
    console.log(bookings);
  } catch (err) {
    next(err);
  }
};
