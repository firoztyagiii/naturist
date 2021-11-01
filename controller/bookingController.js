const Model = require("../model/allModels");

exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Model.Booking.find({ user: req.user._id });
    res.status(200).json({
      status: "success",
      data: {
        bookings,
      },
    });
  } catch (err) {
    next(err);
  }
};
