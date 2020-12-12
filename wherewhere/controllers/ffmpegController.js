//const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
//ffmpeg.setFfmpegPath(ffmpegPath);
const AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname+'/../config/s3.json');
const S3 = new AWS.S3({region: 'ap-northeast-2'});
const stream = require('stream');

module.exports = {
    createPreviewVideo: async(inputPath)=>{
        let pt = new stream.PassThrough();
        const fileName = inputPath.split('original/')[1];
        ffmpeg(inputPath)
            //.setFfmpegPath(ffmpegPath)
            .inputOptions('-ss 0')
            .outputOptions('-t 4')
            .outputOptions('-movflags frag_keyframe+empty_moov')
            //.outputOption('-movflags')
            .noAudio()
            .size('1280x720')
            .toFormat('mp4')
            .output(pt,{end: true})
            .on('progress', (p)=>{
                //console.log('create preview video process : ', p);
            })
            .on('error', (err, stdout, stderr)=>{
                console.log("err : ", err);
            })
            .run();
        return await S3.upload({
            Bucket: "wherewhere-bucket",
            Body: pt,
            Key: `videos/thumb/${fileName}`
        }).promise();

    }
};