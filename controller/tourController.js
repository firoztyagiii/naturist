const Tour = require("../model/tourModel");
const FilterQuery = require("../utils/filterQuery");

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
    const query = Tour.find();
    const tours = await new FilterQuery(query, req.query)
      .filter()
      .sort()
      .select()
      .query // --> Query (Find) --> Projection (Select) --> Sort --> Skip --> Limit
      .res.status(200)
      .json({
        status: "success",
        result: tours.length,
        data: {
          tours,
        },
      });
  } catch (err) {
    next(err);
  }
};
