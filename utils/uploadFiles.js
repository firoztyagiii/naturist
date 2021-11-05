const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const slugify = require("slugify");

const spacesEndpoint = new aws.Endpoint(process.env.SPACES_ENDPOINT);
const S3 = new aws.S3({
  endpoint: spacesEndpoint,
});

const upload = multer({
  storage: multerS3({
    s3: S3,
    bucket: process.env.SPACES_BUCKET_NAME,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      const uploadName = `${req.file.originalname.split(".")[0]}-${Date.now().toString()}.${
        req.file.originalname.split(".")[1]
      }`;
      const finalName = slugify(uploadName, {
        replacement: "-",
        lower: false,
        trim: true,
      });
      cb(null, finalName);
    },
  }),
});

module.exports = upload;
