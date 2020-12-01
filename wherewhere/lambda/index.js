const AWS = require('aws-sdk');
const Sharp = require('sharp');
AWS.config.loadFromPath(__dirname+ '/../config/s3.json');
const S3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
    const Bucket = event.Records[0].s3.bucket.name; 
    const Key = event.Records[0].s3.object.key; 
    const filename = Key.split('/')[Key.split('/').length - 1]; 
    const ext = Key.split('.')[Key.split('.').length - 1]; 
    const requiredFormat = ext === 'jpg' ? 'jpeg' : ext;
    try { 
        const s3Object = await S3.getObject({
            // S3로부터 이미지를 get 
            Bucket,
            Key, 
        }).promise(); 
        const resizedImage = await Sharp(s3Object.Body) // Sharp 패키지를 이용한 리사이즈 진행 
        .resize(400, 400, { 
            fit: 'inside', 
        }) 
        .toFormat(requiredFormat) 
        .toBuffer(); 
        await S3.putObject({ // 리사이즈한 이미지를 thumb 폴더에 저장한다. 
            Body: resizedImage, 
            Bucket, 
            Key: `thumb/${filename}`, 
        }).promise(); 
        console.log('success'); 
        return callback(null, `thumb/${filename}`); 
    } catch (error) {
        console.error(error); 
        return callback(error); 
    } 
};

