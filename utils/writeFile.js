const path = require("path");
const AppError = require("../utils/error");
const fs = require("fs");

module.exports = function (buffer, filename) {
  fs.writeFile(
    `${path.join(__dirname, `../public/uploads/${filename}`)}`,
    buffer,
    function (err) {
      if (err) {
        throw new AppError(
          500,
          "Unable to upload/save the file, Please try again later"
        );
      }
    }
  );
};
