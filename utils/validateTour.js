const { check, validationResult } = require("express-validator");
const AppError = require("../utils/error");

exports.checkBody = () => {
  return [
    check("name", "Name must have min 10 and max 20 characters")
      .notEmpty()
      .isLength({
        min: 10,
        max: 20,
      }),
    check("difficulty", "Difficulty can only be easy, medium or hard")
      .toLowerCase()
      .notEmpty()
      .isIn(["easy", "medium", "hard"]),
    check("price", "Price must be greater than 0")
      .notEmpty()
      .isFloat({ min: 0 }),
    check("groupSize", "Group size can't be exceeded more than 10")
      .notEmpty()
      .isFloat({
        min: 0,
        max: 10,
      }),
    check("info").notEmpty().isLength({ max: 70 }),
    check("description").notEmpty().isLength({ min: 100, max: 400 }),
    check("location", "Location must not be empty").notEmpty(),
    check("tourLength", "Tour can't be longer more than 7 days and minimum 3")
      .notEmpty()
      .isFloat({ min: 3, max: 7 }),
    // check("dates", "Dates cannot be empty").isEmpty(),
  ];
};

exports.areErrors = (req, res, next) => {
  try {
    const err = validationResult(req);
    if (err.isEmpty()) {
      next();
    } else {
      const errMsg = err.errors.map((error) => {
        return `${error.msg}, `;
      });
      throw new AppError(400, errMsg.join(" "));
    }
  } catch (err) {
    next(err);
  }
};
