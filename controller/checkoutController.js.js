const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Model = require("../model/allModels");

exports.getCheckoutSession = async (req, res, next) => {
  try {
    const tour = await Model.Tour.findOne({ _id: req.params.tourId });

    const session = await stripe.checkout.sessions.create({
      success_url: "https://naturist.herokuapp.com/checkout/confirm-checkout",
      cancel_url: "https://naturist-front.herokuapp.com/",
      payment_method_types: ["card"],
      customer_email: req.user.email,
      line_items: [
        {
          name: tour.name.toUpperCase(),
          quantity: 1,
          images: [`https://naturist.herokuapp.com/${tour.headImg}`],
          amount: tour.price * 100,
          description: tour.info,
          currency: "usd",
        },
      ],
    });
    res.status(200).json({
      status: "success",
      session,
    });
  } catch (err) {
    next(err);
  }
};

exports.confirmCheckout = async (req, res, next) => {
  console.log(req.body);
};
