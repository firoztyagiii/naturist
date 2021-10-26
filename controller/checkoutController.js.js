const Model = require("../model/allModels");
const Razorpay = require("razorpay");

const rzrpy = new Razorpay({
  key_id: "rzp_test_iQXxC9LBZRPfH9",
  key_secret: "aEoBGobKOlheWd6RJeVzoyPW",
});

exports.getCheckoutSession = async (req, res, next) => {
  try {
    const tour = await Model.Tour.findOne({ _id: req.params.tourId });
    const order = await rzrpy.orders.create({
      amount: tour.price * 100,
      currency: "USD",
      payment_capture: true,
      notes: {
        name: tour.name,
        reference_id: tour._id,
        username: req.user.name,
        email: req.user.email,
      },
    });
    res.status(200).json({ order: order });
  } catch (err) {
    next(err);
  }
};
