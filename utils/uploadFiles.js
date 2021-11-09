const multer = require("multer");
const slugify = require("slugify");
const multerS3 = require("multer-s3");

const S3 = require("./S3Config");

const upload = multer({
  storage: multerS3({
    s3: S3,
    bucket: process.env.SPACES_BUCKET_NAME,
    acl: "public-read",

    key: function (req, file, cb) {
      const uploadName = `${file.originalname.split(".")[0]}-${Date.now().toString()}.${
        file.originalname.split(".")[1]
      }`;
      const finalName = slugify(uploadName, {
        replacement: "-",
        lower: false,
        remove: /[*+~()/'"!:@]/g,
        trim: true,
      });
      cb(null, finalName);
    },
  }),
});

module.exports = upload;
