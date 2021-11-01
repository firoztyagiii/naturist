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
        reference_id: tour._id,
        username: req.user.name,
        email: req.user.email,
        user: req.user._id,
      },
    });
    res.status(200).json({ order: order });
  } catch (err) {
    next(err);
  }
};

exports.confirmCheckout = async (req, res, next) => {
  console.log("PAYLOAD--->", req.body.payload);
  const signature = req.headers["x-razorpay-signature"];

  const body = req.body.payload.payment.entity.order_id + "|" + req.body.payload.payment.entity.id;

  const crypto = require("crypto");
  const expectedSignature = crypto.createHmac("sha256", "aEoBGobKOlheWd6RJeVzoyPW").update(body.toString()).digest("hex");

  if (expectedSignature === signature) {
    console.log("Payment Verified");
  }
};
