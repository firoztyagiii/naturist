const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    trim: true,
    minlength: [10, "Review should be atleast 10 characters long"],
    required: [true, "Review is required"],
  },
  rating: {
    type: Number,
    min: [1, "Rating cannot be lower than 1"],
    max: [5, "Rating cannot be higher than 5"],
    required: [true, "Rating is required"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
  },
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: "tours",
  },
});

reviewSchema.statics.updateToursReview = async function (review) {
  const data = await review.constructor.aggregate([
    { $match: { tour: review.tour } },
    {
      $group: {
        _id: null,
        totalRatings: { $sum: 1 },
        averageRatings: { $avg: "$rating" },
      },
    },
  ]);
  const tour = await Tour.findOneAndUpdate(
    { _id: review.tour },
    {
      totalRatings: data[0].totalRatings,
      averageRatings: data[0].averageRatings,
    },
    {
      new: true,
    }
  );
};

reviewSchema.pre("findOne", function (next) {
  this.populate({
    path: "user",
    select: "name",
  }).populate({
    path: "tour",
    select: "name price totalRatings averageRatings",
  });
  next();
});

reviewSchema.post("save", function (doc) {
  this.constructor.updateToursReview(doc);
});

const Review = mongoose.model("reviews", reviewSchema);

module.exports = Review;
