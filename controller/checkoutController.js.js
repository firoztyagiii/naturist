const Model = require("../model/allModels");
const Razorpay = require("razorpay");
const AppError = require("../utils/error");
const createInvoice = require("../utils/createInvoice");

const rzrpy = new Razorpay({
  key_id: "rzp_test_iQXxC9LBZRPfH9",
  key_secret: "aEoBGobKOlheWd6RJeVzoyPW",
});

exports.getCheckoutSession = async (req, res, next) => {
  try {
    const tour = await Model.Tour.findOne({ _id: req.params.tourId });
    if (!tour) {
      throw new AppError(400, "Invalid tour ID");
    }
    const order = await rzrpy.orders.create({
      amount: tour.price * 100,
      currency: "USD",
      payment_capture: true,
      notes: {
        referenceId: tour._id.toString(),
        username: req.user.name,
        email: req.user.email,
        user: req.user._id.toString(),
      },
    });
    res.status(200).json({ order: order });
  } catch (err) {
    next(err);
  }
};

exports.confirmCheckout = async (req, res, next) => {
  const signature = req.headers["x-razorpay-signature"];
  const price = req.body.payload.payment.entity.amount / 100;
  const tour = req.body.payload.payment.entity.notes.referenceId;
  const user = req.body.payload.payment.entity.notes.user;
  const orderId = req.body.payload.payment.entity.order_id;
  const currency = req.body.payload.payment.entity.currency;
  const method = req.body.payload.payment.entity.method;
  const contact = req.body.payload.payment.entity.contact;

  const crypto = require("crypto");
  const expectedSignature = crypto.createHmac("sha256", "kingroot").update(JSON.stringify(req.body)).digest("hex");

  if (expectedSignature === signature) {
    const booking = await Model.Booking.create({ user, tour, price, orderId, currency, method, contact });
    const invoiceData = await Model.Booking.findOne({ orderId })
      .populate({
        path: "user",
        select: "email",
      })
      .populate({
        path: "tour",
      });
    console.log("INVOICE DATA --->", invoiceData);
    createInvoice(invoiceData);
    res.status(200).json({
      status: "success",
      data: {
        booking,
      },
    });
  }
};
