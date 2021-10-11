const ReviewModel = require("../model/reviewModel");
const AppError = require("../utils/error");

exports.postReview = async (req, res, next) => {
  try {
    if (!req.body.tour) req.body.tour = req.params.id;
    if (!req.body.tour) throw new AppError(400, "Could not get the tour");
    const { review, rating } = req.body;
    const rev = await ReviewModel.create({
      review,
      rating,
      user: req.user._id,
      tour: req.body.tour,
    });
    res.status(201).json({
      status: "success",
      data: {
        rev,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await ReviewModel.find();
    res.status(200).json({
      status: "success",
      result: reviews.length,
      data: {
        reviews,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    let query;
    if (!req.params.id) {
      query = ReviewModel.findOne({ _id: reviewId });
    } else if (req.params.id && reviewId) {
      query = ReviewModel.findOne({
        $and: [{ _id: reviewId }, { tour: req.params.id }],
      });
    }
    const review = await query;
    res.status(200).json({
      status: "success",
      data: {
        review,
      },
    });
  } catch (err) {
    next(err);
  }
};
