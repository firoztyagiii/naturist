const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Model = require("../model/allModels");

exports.getCheckoutSession = async (req, res, next) => {
  try {
    const tour = await Model.Tour.findOne({ _id: req.params.tourId });

    const session = await stripe.checkout.sessions.create({
      success_url: "https://naturist-front.herokuapp.com/",
      cancel_url: "https://naturist-front.herokuapp.com/",
      payment_method_types: ["card"],
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
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
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook error, ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const tourId = event.data.object.client_reference_id;
    const userId = event.data.object.customer_email;
    const price = event.data.object.line_items[0].amount / 100;
    const booking = await Model.Booking.create({ tour: tourId, user: userId, price });
    res.status(200).json({
      received: true,
    });
  }
};
