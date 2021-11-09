const AppError = require("../utils/error");

module.exports = (req, res, next) => {
  const error = [];

  if (!req.body.name || req.body.name.length > 20 || req.body.name.length < 10) {
    error.push({ field: "name", message: "Name is required, Min 10 and max 20 chars" });
  }
  if (!req.body.location) {
    error.push({ field: "location", message: "Location is required" });
  }
  if (!req.body.difficulty) {
    error.push({ field: "difficulty", message: "Difficulty is required" });
  }
  if (req.body.difficulty) {
    if (!["easy", "medium", "hard"].includes(req.body.difficulty)) {
      error.push({ field: "difficulty", message: "Difficulty can only be easy, medium or hard" });
    }
  }
  if (!req.body.price || req.body.price < 0) {
    error.push({ field: "price", message: "Price is required and min 0" });
  }
  if (!req.body.groupSize || req.body.groupSize > 10 || req.body.groupSize < 1) {
    error.push({ field: "groupsize", message: "Group size is required and Min 1 max 10" });
  }
  if (!req.body.info || req.body.info.length > 70) {
    error.push({ field: "info", message: "Info is required and max 70 chars" });
  }
  if (!req.body.description || req.body.info.description > 400 || req.body.description < 100) {
    error.push({ field: "description", message: "Description is required and min 100 max 400" });
  }
  if (!req.body.tourLength || req.body.tourLength > 7 || req.body.tourLength < 3) {
    error.push({ field: "tourlength", message: "Tour length is required and Min 3 max 7" });
  }
  if (!req.body.dates) {
    error.push({ field: "dates", message: "3 dates are required seperated by comma" });
  }
  if (req.body.dates) {
    req.body.dates = req.body.dates.split(",");
    if (req.body.dates.length < 3) {
      error.push({ field: "dates", message: "3 dates are required" });
    }
  }
  if (!req.files) {
    error.push({ field: "images", message: "1 headImg and 3 images are required" });
  }
  if (req.files) {
    if (!req.files.headImg) {
      error.push({ field: "headImg", message: "1 headImg is required" });
    }
    if (!req.files.images) {
      error.push({ field: "images", message: "3 images are required" });
    }
    if (req.files.images) {
      if (req.files.images.length < 3) {
        error.push({ field: "images", message: "Exactly 3 images are required" });
      }
    }
  }
  if (error.length > 0) {
    throw new AppError(400, error);
  }
  next();
};
