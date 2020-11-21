const ffmpegModel = require('../models/ffmpegModel');
module.exports = {
    createFragmentPreview: async(req, res)=>{
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
    }
};