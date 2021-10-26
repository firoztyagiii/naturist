const Model = require("../model/allModels");
const Razorpay = require("razorpay");

const secret_key = "aEoBGobKOlheWd6RJeVzoyPW";

const rzrpy = new Razorpay({
  key_id: "rzp_test_iQXxC9LBZRPfH9",
  key_secret: secret_key,
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
        userId: user.req._id,
      },
    });
    res.status(200).json({ order: order });
  } catch (err) {
    next(err);
  }
};

exports.confirmCheckout = async (req, res, next) => {
  console.log("BODY ===>", req.body);
  const signature = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
  console.log(signature);
  var expectedSignature = crypto.createHmac("sha256", secret_key).update(signature.toString()).digest("hex");
  if (expectedSignature === req.body.response.razorpay_signature) {
    console.log(true);
  }
};
