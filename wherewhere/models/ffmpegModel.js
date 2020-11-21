const ffmpegFunction = require('../modules/ffmpegFunction');
const ffmpeg = require('fluent-ffmpeg');

module.exports = {
    createFragmentPreview: async (inputPath, outputPath, fragmentDurationInSeconds) =>{
        /*
        return new Promise(async (resolve, reject) => {
            const { durationInSeconds: videoDurationInSeconds } = await ffmpegFunction.getVideoInfo(
                inputPath,
            );
        
            const startTimeInSeconds = await ffmpegFunction.getStartTimeInSeconds(
                videoDurationInSeconds,
                fragmentDurationInSeconds,
            );
            console.log(videoDurationInSeconds, startTimeInSeconds);

            return ffmpeg()
                .input(inputPath)
                .inputOptions([`-ss ${startTimeInSeconds}`])
                .outputOptions([`-t ${fragmentDurationInSeconds}`])
                .noAudio()
                .output(outputPath)
                .on('end', resolve)
                .on('error', reject)
                .run();
        });
        */
        
        try{
            const {durationInSeconds : videoDurationInSeconds} = await ffmpegFunction.getVideoInfo(inputPath);
            const startTimeInSeconds = await ffmpegFunction.getStartTimeInSeconds(videoDurationInSeconds, fragmentDurationInSeconds);
            console.log(videoDurationInSeconds, startTimeInSeconds);
            return ffmpeg()
                .input(inputPath)
                .inputOptions([`-ss ${startTimeInSeconds}`])
                .outputOptions([`-t ${fragmentDurationInSeconds}`])
                .noAudio()
                .size('1280x720')
                .output(outputPath)
                .outputFormat('mp4')
                .on('end', function () {
                    console.log('Successfully Created Fragment Preview');
                })
                .on('error', function (err) {
                    console.log('createFragmentPreview error happened', err);
                    return;
                })
                .run();
        }catch(err){
            console.log('createFragmentPreview ERROR : ', err);
            throw err;
        }
    }
};