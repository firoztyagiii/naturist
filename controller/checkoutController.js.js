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
        referenceId: tour._id,
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
  const signature = req.headers["x-razorpay-signature"];
  console.log(req.body.payload.payment);
  const orderId = req.body.payload.payment.entity.order_id;
  const amount = req.body.payload.payment.entity.amount / 100;

  const crypto = require("crypto");
  const expectedSignature = crypto.createHmac("sha256", "kingroot").update(JSON.stringify(req.body)).digest("hex");

  console.log("SIGNATURE--->", signature);
  console.log("EXPECTED--->", expectedSignature);

  if (expectedSignature === signature) {
    console.log("Payment Verified");
  }
};
