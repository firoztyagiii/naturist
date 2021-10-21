const AppError = require("../utils/error");
const Model = require("../model/allModels");

exports.postReview = async (req, res, next) => {
  try {
    if (req.params.id) req.body.tour = req.params.id;
    if (!req.body.tour) throw new AppError(400, "Could not get the tour");

    const { review, rating } = req.body;

    if (!review || !rating) {
      throw new AppError(400, "Review and ratings are required!");
    }

    const rev = await Model.Review.create({
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
    let obj = {};
    const id = req.params.id;
    if (id) {
      obj.tour = id;
    }

    const reviews = await Model.Review.find(obj);

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
      query = Model.Review.findOne({ _id: reviewId });
    } else if (req.params.id && reviewId) {
      query = Model.Review.findOne({
        $and: [{ _id: reviewId }, { tour: req.params.id }],
      });
    }
    const review = await query;

    if (!review) {
      throw new AppError("Invalid id or review was deleted!");
    }

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

exports.patchReview = async (req, res, next) => {
  try {
    const reviewId = req.params.reviewId;
    const { review, rating } = req.body;

    if (!review && !rating) {
      throw new AppError(400, "Need review or rating in order to update an review!");
    }

    const updatedReview = await Model.Review.findOneAndUpdate({ _id: reviewId }, { review, rating }, { new: true });

    res.status(201).json({
      status: "success",
      data: updatedReview,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteReview = async (req, res, next) => {
  try {
    const id = req.params.reviewId;
    await Model.Review.findOneAndDelete({ _id: id });
    res.status(204).json({});
  } catch (err) {
    err.message = "Something went wrong!";
    next(err);
  }
};
