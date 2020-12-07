const ffmpegModel = require('../models/ffmpegModel');
const {exec} = require('child_process');
//const fbDownloader = require('fb-video-downloader');
/*
const https = require('https');
const fs = require('fs');
*/

module.exports = {
    createFragmentPreview: async(inputPath, outputPath)=>{
        //fbDownloader.getInfo(req.body.url).then((info) => console.log(JSON.stringify(info, null, 2)))
        /*
        const file = fs.createWriteStream("my.mp4");
        const request = https.get("https://www.youtube.com/watch?v=3Y9ZDF4F98s", function(response){
            response.pipe(file)
        });
        */
        
        const cmd = `ffmpeg -ss 1 -i "${inputPath}" -y -an -t 4 "${outputPath}"`;
        const result = exec(cmd, function(error, stdout, stderr){
            if(error){
                console.log(error.stack);
                console.log('Error Code : ', error.code);
                console.log('Signal Received : ', error.signal);
            }
            console.log('child process stdout : ', stdout);
            console.log('child process stderr : ', stderr);
        });
        result.on('exit', function(code){
            console.log('child process exited with exit code ', code);
        })
        
        
        /*
        try{
            const inputPath = req.body.inputPath;
            const outputPath = `C:\\Users\\lg\\Desktop\\wherewhere\\my2.mp4`;
            //const result = await ffmpegModel.createFragmentPreview(inputPath, outputPath, 4);
            //console.log('Controller result : ', result);
            await ffmpegModel.createFragmentPreview(inputPath, outputPath, 4);
            return res.send('success');
        }catch(err){
            console.log('createFragmentPreview ERROR : ', err);
            return res.send(err);
        }
        */
    }
};