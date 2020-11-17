const ffmpegFunction = require('../modules/ffmpegFunction');

module.exports = {
    createFragmentPreview: async (inputPath, outputPath, fragmentDurationInSeconds = 4) =>{
        try{
            const {durationInSeconds: videoDurationInSeconds} = await ffmpegFunction.getVideoInfo(inputPath);
            const startTimeInSeconds = await ffmpegFunction.getStartTimeInSeconds(videoDurationInSeconds, fragmentDurationInSeconds);
            return ffmpeg()
                    .input(inputPath)
                    .inputOptions([`-ss ${startTimeInSeconds}`])
                    .outputOptions([`-t ${fragmentDurationInSeconds}`])
                    .noAudio()
                    .output(outputPath)
                    .on('end')
                    .on('error')
                    .run();
            /**
             * postman test 해봐야 할 듯.
             */
        }catch(err){
            console.log('createFragmentPreview ERROR : ', err);
            throw err;
        }
    }
}