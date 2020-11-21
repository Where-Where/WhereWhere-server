const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname + '/../config/s3.json');

// AWS.config.update({
//     accessKeyId: process.env.S3_ACCESS_KEY_ID,
//     secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
//     region: 'ap-northeast-2',
//   });

const upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: 'wherewhere',
        acl: 'public-read',
        key(req, file, cb) {
            cb(null, `original/${Date.now()}${path.basename(file.originalname)}`);
          },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
// original폴더에 파일이 업로드되면 이미지 리사이징
// original폴더 부분을 thumb로 교체
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
    console.log(req.file);
    const originalUrl = req.file.location;
    const url = originalUrl.replace(/\/original\//, '/thumb/');
    res.json({ url, originalUrl });
  });

  
module.exports = upload;