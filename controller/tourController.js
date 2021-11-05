const Model = require("../model/allModels");
const AppError = require("../utils/error");
const filterQuery = require("../utils/filterQuery");
const upload = require("../utils/uploadFiles");

exports.isNameExisted = async (req, res, next) => {
  try {
    const existedTour = await Model.Tour.findOne({ name: req.body.name });
    if (existedTour) {
      throw new AppError(400, "Tour already exists with this name");
    }
    next();
  } catch (err) {
    next(err);
  }
};

exports.postTour = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError(400, "Head Img is required");
    }
    const { name, location, difficulty, price, groupSize, info, description, tourLength, dates } = req.body;

    const uploadFileData = upload.single("headImg");

    let headImg;
    uploadFileData((req, res, err) => {
      if (err) throw new AppError(400, "Could not upload the file, Please try again later");
      headImg = req.location;
    });

    const tour = await Model.Tour.create({
      name,
      location,
      difficulty,
      price,
      groupSize,
      info,
      description,
      tourLength,
      dates,
      headImg,
    });

    res.status(201).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

exports.getTours = async (req, res, next) => {
  try {
    const queryData = await filterQuery(req.query, Model.Tour);
    const data = await queryData.toursQuery;
    res.status(200).json({
      status: "success",
      result: data.length,
      totalDocs: queryData.totalDoc,
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
    const { name, location, difficulty, price, groupSize, info, description, tourLength, dates } = req.body;
    const tourId = req.params.id;
    const tour = await Model.Tour.findOneAndUpdate(
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
    await Model.Tour.findOneAndDelete({ _id: tourId });
    res.status(200).json({});
  } catch (err) {
    err.message = "Something went wrong";
    next(err);
  }
};

exports.getTour = async (req, res, next) => {
  try {
    const tourId = req.params.id;
    const tour = await Model.Tour.findOne({ _id: tourId }).populate({
      path: "reviews",
      populate: {
        path: "user",
        select: "name createdAt profilePhoto",
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
