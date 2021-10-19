const mongoose = require("mongoose");
const slugify = require("slugify");
const Model = require("./allModels");

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    lowercase: true,
    required: [true, "Tour name is required"],
    unique: true,
    maxlength: [20, "Title cannnot be exceeded more than 20 characters"],
    minlength: [10, "Title must have atleast 10 characters"],
  },
  location: {
    type: String,
    trim: true,
    required: [true, "Location is required"],
  },
  difficulty: {
    type: String,
    required: [true, "Difficulty is required"],
    enum: {
      values: ["easy", "medium", "hard"],
      message: "Difficulty can only be easy, medium or hard",
    },
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    validate: {
      validator: function (value) {
        return value > 0;
      },
      message: "Price must be greater than 0",
    },
  },
  totalRatings: {
    type: Number,
    default: 1,
  },
  averageRatings: {
    type: Number,
    default: 1,
  },
  groupSize: {
    type: Number,
    required: [true, "Group size is required"],
    min: [1, "Group size can't be below than 1"],
    max: [10, "Group size can't be exceeded more than 10"],
  },
  info: {
    type: String,
    required: [true, "Info is required"],
    maxlength: [70, "Info can only be 70 characters long"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [100, "Description should be atleast 100 characters long"],
    maxlength: [400, "Description can't be more than 400 characters"],
  },
  tourLength: {
    type: Number,
    required: [true, "Tour length is required"],
    min: [3, "Tour should be atleast 3 days"],
    max: [7, "Tour can't be longer more than 7 days"],
  },
  slug: {
    type: String,
  },
  dates: [
    {
      type: Date,
      required: [true, "At least 1 date is required"],
    },
  ],
  headImg: {
    type: String,
    required: [true, "Head image is required"],
  },
});

tourSchema.set("toObject", { virtuals: true });
tourSchema.set("toJSON", { virtuals: true });

tourSchema.statics.deleteReviews = async function (tour) {
  const tourId = tour._id;
  await Model.Review.deleteMany({ tour: tourId });
};

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, {
    replacement: "-",
    lower: true,
  });
  next();
});

tourSchema.post("findOneAndDelete", function (doc) {
  this.model.deleteReviews(doc);
});

tourSchema.virtual("reviews", {
  ref: "reviews",
  localField: "_id",
  foreignField: "tour",
});

const Tour = mongoose.model("tours", tourSchema);

module.exports = Tour;
