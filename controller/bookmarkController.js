const Model = require("../model/allModels");
const AppError = require("../utils/error");

exports.postBookmark = async (req, res, next) => {
  try {
    let id;
    if (req.body.tourId) {
      id = req.body.tourId;
    } else if (req.params.tourId) {
      id = req.params.tourId;
    }

    if (!id) {
      throw new AppError(400, "No tour ID found");
    }

    const tour = await Model.Tour.findOne({ _id: id });

    if (!tour) {
      throw new AppError(400, "Invalid tour ID");
    }

    const user = await Model.User.findOne({ _id: req.user._id, bookmark: { $in: id } });

    if (user) {
      throw new AppError(400, "Tour is already in your bookmarks");
    }

    await Model.User.findOneAndUpdate({ _id: req.user._id }, { $push: { bookmark: id } });

    res.status(200).json({
      status: "success",
      message: "Added to bookmarks",
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookmarks = async (req, res, next) => {
  try {
    const user = await Model.User.findById(req.user._id).select("bookmark").populate({
      path: "bookmark",
    });
    res.status(200).json({
      result: user.bookmark.length,
      bookmarks: user.bookmark,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteBookmark = async (req, res, next) => {
  try {
    let id;
    if (req.body.tourId) {
      id = req.body.tourId;
    } else if (req.params.tourId) {
      id = req.params.tourId;
    }
    await Model.User.findOneAndUpdate({ _id: req.user._id }, { $pull: { bookmark: id } });
    res.status(202).json({});
  } catch (err) {
    next(err);
  }
};
