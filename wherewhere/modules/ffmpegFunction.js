const ffmpeg = require('fluent-ffmpeg');

module.exports = {
    // video 전체 길이 '초'로 리턴
    getVideoInfo: async (inputPath) => {
        try{
            ffmpeg.ffprobe(inputPath, (err, videoInfo)=>{
                /**에러처리 해야함 */
                const {duration, size} = videoInfo.format;
                return {size, durationInSeconds : Math.floor(duration)};
            });
        }catch(err){
            console.log('getVideoInfo ERROR : ', err);
            throw err;
        }
    },
    getStartTimeInSeconds: async (videoDurationInSeconds, fragmentDurationInSeconds)=>{
        const safeVideoDurationInSeconds = videoDurationInSeconds - fragmentDurationInSeconds;
        if (safeVideoDurationInSeconds <= 0) {
            return 0;
        }
        return await module.exports.getRandomIntegerInRange(0.25 * safeVideoDurationInSeconds, 0.75 * safeVideoDurationInSeconds);
    },
    getRandomIntegerInRange: async(min, max) => {
        const minInt = Math.ceil(min);
        const maxInt = Math.floor(max);
        return Math.floor(Math.random() * (maxInt - minInt + 1) + minInt);
    }
};