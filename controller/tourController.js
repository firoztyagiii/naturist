const Model = require("../model/allModels");
const AppError = require("../utils/error");
const filterQuery = require("../utils/filterQuery");

const aws = require("aws-sdk");
const slugify = require("slugify");

const spacesEndpoint = new aws.Endpoint(process.env.SPACES_ENDPOINT);
const S3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

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
    // const purifedDates = JSON.parse(dates);

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
      headImg: "w",
    });

    req.tour = tour;
    next();
  } catch (err) {
    // console.log(err);
    next(err);
  }
};

exports.uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new AppError(400, "Head Img is required");
    }

    const uploadName = `${req.file.originalname.split(".")[0]}-${Date.now().toString()}.${
      req.file.originalname.split(".")[1]
    }`;

    const finalName = slugify(uploadName, {
      replacement: "-",
      lower: false,
      remove: /[*+~()/'"!:@]/g,
      trim: true,
    });

    const params = {
      Key: finalName,
      Body: req.file.buffer,
      Bucket: process.env.SPACES_BUCKET_NAME,
      ContentType: "image/*",
      ACL: "public-read",
    };

    const response = await S3.upload(params).promise();
    const newTour = await Model.Tour.findOneAndUpdate(
      { _id: req.tour._id },
      { headImg: response.Location },
      { new: true }
    );
    res.status(201).json({
      status: "success",
      data: {
        newTour,
      },
    });
  } catch (err) {
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
