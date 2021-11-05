const multer = require("multer");
const aws = require("aws-sdk");
const slugify = require("slugify");
const multerS3 = require("multer-s3");

const spacesEndpoint = new aws.Endpoint(process.env.SPACES_ENDPOINT);
const S3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
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
      const uploadName = `${file.originalname.split(".")[0]}-${Date.now().toString()}.${
        file.originalname.split(".")[1]
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
