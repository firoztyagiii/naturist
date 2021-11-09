const slugify = require("slugify");

const S3 = require("./S3Config");

const getImages = async (req) => {
  const imagesData = [];
  for (const el in req.files) {
    for await (const img of req.files[el]) {
      const uploadName = `${img.originalname.split(".")[0]}-${Date.now().toString()}.${img.originalname.split(".")[1]}`;

      const finalName = slugify(uploadName, {
        replacement: "-",
        lower: false,
        remove: /[*+~()/'"!:@]/g,
        trim: true,
      });

      const params = {
        Key: finalName,
        Body: img.buffer,
        Bucket: process.env.SPACES_BUCKET_NAME,
        ContentType: "image/*",
        ACL: "public-read",
      };
      const response = await S3.upload(params).promise();
      if (img.fieldname === "headImg") {
        response.headImage = true;
      }
      imagesData.push(response);
    }
  }
  const images = imagesData
    .filter((item) => {
      if (!item.headImage) {
        return item.Location;
      }
    })
    .map((el) => el.Location);
  const headImg = imagesData
    .filter((item) => {
      if (item.headImage) {
        return item.Location;
      }
    })
    .map((el) => el.Location);
  return {
    images,
    headImg,
  };
};

module.exports = getImages;
