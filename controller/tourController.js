const Tour = require("../model/tourModel");
const AppError = require("../utils/error");
const filterQuery = require("../utils/filterQuery");

exports.postTour = async (req, res, next) => {
  try {
    const {
      name,
      location,
      difficulty,
      price,
      groupSize,
      info,
      description,
      tourLength,
      dates,
    } = req.body;

    const tour = await Tour.create({
      name,
      location,
      difficulty,
      price,
      groupSize,
      info,
      description,
      tourLength,
      dates,
    });
    res.status(201).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTours = async (req, res, next) => {
  try {
    const query = filterQuery(req.query, Tour);
    const data = await query;
    res.status(200).json({
      status: "success",
      result: data.length,
      data: {
        tours: data,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.patchTour = async (req, res, next) => {
  try {
    const {
      name,
      location,
      difficulty,
      price,
      groupSize,
      info,
      description,
      tourLength,
      dates,
    } = req.body;
    const tourId = req.params.id;
    const tour = await Tour.findOneAndUpdate(
      { _id: tourId },
      {
        name,
        location,
        difficulty,
        price,
        groupSize,
        info,
        description,
        tourLength,
        dates,
      },
      { new: true }
    );
    res.status(201).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTour = async (req, res, next) => {
  try {
    const tourId = req.params.id;
    const tour = await Tour.findOneAndDelete({ _id: tourId });
    res.status(200).json({});
  } catch (err) {
    res.status(400).json({});
  }
};

exports.getTour = async (req, res, next) => {
  try {
    const tourId = req.params.id;
    const tour = await Tour.findOne({ _id: tourId }).populate({
      path: "reviews",
      populate: {
        path: "user",
      },
    });

    if (!tour) throw new AppError(400, "Invalid ID");
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    next(err);
  }
};
