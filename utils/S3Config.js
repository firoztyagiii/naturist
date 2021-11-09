const aws = require("aws-sdk");

const spacesEndpoint = new aws.Endpoint(process.env.SPACES_ENDPOINT);
const S3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

module.exports = S3;
