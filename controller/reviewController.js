const ReviewModel = require("../model/reviewModel");

exports.postReview = async (req, res, next) => {
  try {
    const tourId = "61614da7a6928335d83f4b42";
    const { review, rating } = req.body;
    const rev = await ReviewModel.create({
      review,
      rating,
      user: req.user._id,
      tour: tourId,
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
