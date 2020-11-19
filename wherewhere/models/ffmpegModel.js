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
                    .size('1280x720')
                    .output(outputPath)
                    .on('end', function(){
                        console.log('Successfully Created Fragment Preview');
                    })
                    .on('error', function(err){
                        console.log('createFragmentPreview error happened', err);
                        return;
                    })
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