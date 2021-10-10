const Tour = require("../model/tourModel");
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
    console.log(err);
  }
};
