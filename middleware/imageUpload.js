const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
require('dotenv/config');
const multer = require('multer');

const creds = new aws.Credentials(
  process.env.S3_ACCESS_KEY,
  process.env.S3_SECRET_KEY
);

const s3 = new aws.S3({
  credentials: creds,
  region: 'ap-south-1',
});

module.exports = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'wedfield',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(
        null,
        req.user !== undefined
          ? `${req.user._id}_${file.fieldname}_${Date.now().toString()}_${
              file.originalname
            }`
          : `${Date.now().toString()}_${file.originalname}`
      );
    },
  }),
  limits: { fieldSize: 100 * 1920 * 1080 },
});
