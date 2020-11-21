const ffmpeg = require('fluent-ffmpeg');

module.exports = {
    // video 전체 길이 '초'로 리턴
    getVideoInfo: async (inputPath) => {
        return new Promise((resolve, reject)=>{
            return ffmpeg.ffprobe(inputPath, (err, videoInfo)=>{
                if(err){
                    return reject(err);
                }
                const {duration, size} = videoInfo.format;
                return resolve({
                    size,
                    durationInSeconds : Math.floor(duration)
                });
            });
        });
        
        /*
        try{
            const result = ffmpeg.ffprobe(inputPath, (_err, videoInfo) => {
                const { duration } = videoInfo.format;
                const durationInSeconds = Math.floor(duration);
                console.log('durationInSeconds : ', durationInSeconds);
                return durationInSeconds;
                //return {size, durationInSeconds};
            });
            console.log('result : ', result);
            return result;
        }catch(err){
            console.log('getVideoInfo ERROR : ', err);
            throw err;
        }
        */
    },
    getStartTimeInSeconds: async (videoDurationInSeconds, fragmentDurationInSeconds)=>{
        const safeVideoDurationInSeconds = videoDurationInSeconds - fragmentDurationInSeconds;
        if (safeVideoDurationInSeconds <= 0) {
            return 0;
        }
        return module.exports.getRandomIntegerInRange(0.25 * safeVideoDurationInSeconds, 0.75 * safeVideoDurationInSeconds)
    },
    getRandomIntegerInRange: async(min, max) => {
        const minInt = Math.ceil(min);
        const maxInt = Math.floor(max);
        return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
    }
};