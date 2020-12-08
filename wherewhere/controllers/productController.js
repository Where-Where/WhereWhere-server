const productModel = require('../models/productModel');
const statusCode = require('../modules/statusCode');
const resMessage = require('../modules/resMessage');
const util = require('../modules/util');
const facebookCrawler = require('../crawl/facebookCrawl');
const instagramCrawler = require('../crawl/instagramCrawl');
const downloadModule = require('../modules/downloadToS3');
const downloadModuleVid = require('../modules/VIDdownloadToS3');
const ffmpegController = require('./ffmpegController');
const randomString = require('randomstring');
const request = require('request');
module.exports = {
    /*
    register: async(req, res)=>{
        try{
            const _id = req.decoded._id;
            const {
                siteUrl, dataUrl, resizedDataUrl, title, description, plural
            } = req.body;
            const result = await productModel.register({
                siteUrl: siteUrl,
                dataUrl: dataUrl,
                resizedDataUrl: resizedDataUrl,
                title: title,
                description: description,
                plural: plural,
                userIdx: _id
            });
            return res.send(result);
        }catch(err){
            return res.status(500).send(err);
        }
    },
    */
    /*
    registerDummyImgs: async(req, res)=>{
        const _id = req.decoded._id;
        let imageLocations = {};
        for(var i=0; i<req.files.length; i++){
            imageLocations["image"]=req.files[i].location;
        }
        const result = await productModel.register({
            siteUrl: "siteUrl",
            dataUrl: dataUrl,
            resizedDataUrl: {
                "category":"image",
                "url":"resizedDataUrl"
            },
            title: title,
            description: description,
            plural: plural,
            userIdx: _id
        });
    }
    */
    //홈 카테고리
    showAllById: async(req, res)=>{
        const _id = req.decoded._id;
        try{
            const result = await productModel.showAllById(_id).exec();
            console.log('result : ', result);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_BY_MAIN, result));
        }catch(err){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
    },
    showByMainCategory: async(req, res)=>{
        const _id = req.decoded._id;
        const mainCategoryIdx = req.params.mainCategoryIdx;
        try{
            const result = await productModel.showByMainCategory(_id, mainCategoryIdx).exec();
            console.log('result : ', result);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_BY_MAIN, result));
        }catch(err){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
    },
    showBySubCategory: async(req, res)=>{
        const _id = req.decoded._id;
        const subCategoryIdx = req.params.subCategoryIdx;
        try{
            const result = await productModel.showProductsBySubCategory(_id, subCategoryIdx).exec();
            console.log('result : ', result);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_BY_SUB, result));
        }catch(err){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
    },
    /*
    uploadImg: async(req, res)=>{
        const _id = req.decoded._id;
        let imageLocations = [];
        for(var i=0; i<req.files.length; i++){
            imageLocations.push({
                "category":"image",
                "url":req.files[i].location
            });
        }
        const result = await productModel.register({
            siteUrl: "siteUrl",
            dataUrl: imageLocations,
            resizedDataUrl: [{
                "category":"image",
                "url":"resizedDataUrl"
            }],
            title: "title",
            description: "description",
            plural: true,
            userIdx: _id
        });
        return res.send(result);
    },
    */
    facebookRegister: async (req, res)=>{
        const _id = req.decoded._id;
        const { siteUrl, capturedImg } = req.body;
        try{
            const result = await facebookCrawler.crawl(siteUrl);
            if(result === "비공개 게시글"){
                console.log("비공개 게시글");
                // capturedImg 로 product 생성
            }else{
                // uri에 watch있는지 없는지 구분
                const {writer, content, datas} = result;
                const returnImages = [];
                const resizedImages = [];
                const originImages = [];
                // facebook은 비디오를 가져올 수 없다.
                var cnt=0;
                var pluralTF = false;
                const imageName = randomString.generate(15);
                datas.forEach(async (element)=>{
                    cnt+=1;
                    if(cnt>=2){
                        pluralTF = true;
                    }
                    //console.log(element["image"]);
                    const returnImg = await downloadModule.download(element["image"], imageName, cnt);
                    returnImages.push({
                        image: returnImg['location']
                    });
                    await request({
                        method: 'POST',
                        url: "https://zywu2rb1mb.execute-api.ap-northeast-2.amazonaws.com/v1/trigger",
                        json: {
                            "bucket": "wherewhere-bucket",
                            "key": returnImg['fileName']
                        },
                    }, function(error, response, body){
                        if(error){
                            throw error;
                        }else{
                            var filename = returnImg['fileName'].split('original/')[1];
                            resizedImages.push({
                                category: "image",
                                url: `https://wherewhere-bucket.s3.ap-northeast-2.amazonaws.com/images/resized/${filename}`
                            });
                            originImages.push({
                                category: "image",
                                url: `https://wherewhere-bucket.s3.ap-northeast-2.amazonaws.com/images/complete/${filename}`
                            });
                        }
                    });
                });
                //console.log('writer, content, resizedImages, originImages : ', writer, content, resizedImages, originImages);
                setTimeout(async function(){
                    const result = await productModel.register({
                        siteUrl: siteUrl,
                        dataUrl: originImages,
                        resizedDataUrl: resizedImages,
                        writer: writer,
                        description: content,
                        plural: pluralTF,
                        userIdx: _id
                    });
                    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.REGISTER_SUCCESS_FB, result));
                }, 6000);
            }
        }catch(err){
            console.log('facebookCrawler error : ', err);
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
    },
    instagramRegister: async(req, res)=>{
        const _id = req.decoded._id;
        const { siteUrl, capturedImg } = req.body;
        try{
            const result = await instagramCrawler.crawler(siteUrl);
            if(result === "인스타그램 크롤링 에러"){
                console.log("인스타그램 크롤링 중 에러 발생, 캡처한 사진으로 저정한다.");
                return;//임의
                //캡처한 걸로 저장
            }else if(result === "비공개 계정"){
                console.log("비공개 계정, siteUrl만 저장한다.");
                const result = await productModel.register({
                    siteUrl: siteUrl,
                    dataUrl: [],
                    resizedDataUrl: [],
                    writer: "비공개",
                    description: "비공개",
                    plural: false,
                    userIdx: _id
                });
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.REGISTER_SUCCESS_INSTA, result));
            }else{
                const {
                    writer,
                    content,
                    datas
                } = result;
                const originDatas = [];
                const resizedDatas = [];
                const newFileName = randomString.generate(17);
                var cnt = 0;
                var pluralTF = false;
                //console.log(writer, content, datas);
                datas.forEach(async (element)=>{
                    cnt+=1;
                    if(cnt>=2){
                        pluralTF = true;
                    }
                    if(element["category"]=="image"){
                        const returnImg = await downloadModule.download(element["url"], newFileName, cnt);
                        await request({
                            method: 'POST',
                            url: "https://zywu2rb1mb.execute-api.ap-northeast-2.amazonaws.com/v1/trigger",
                            json: {
                                "bucket": "wherewhere-bucket",
                                "key": returnImg['fileName']
                            },
                        }, function(error, response, body){
                            if(error){
                                throw error;
                            }else{
                                var filename = returnImg['fileName'].split('original/')[1];
                                resizedDatas.push({
                                    category: "image",
                                    url: `https://wherewhere-bucket.s3.ap-northeast-2.amazonaws.com/images/resized/${filename}`
                                });
                                originDatas.push({
                                    category: "image",
                                    url: `https://wherewhere-bucket.s3.ap-northeast-2.amazonaws.com/images/complete/${filename}`
                                });
                            }
                        });
                    }else{//비디오 저장
                        try{
                            const returnVid = await downloadModuleVid.download(element["url"], newFileName, cnt);
                            //console.log('returnVid : ', returnVid);
                            const inputPath = returnVid["location"];//original vid url
                            const ffmpegResult = await ffmpegController.createPreviewVideo(inputPath);
                            //console.log('ffmpegResult : ', ffmpegResult);
                            const thumbVidUrl = ffmpegResult["Location"];
                            originDatas.push({
                                category: "video",
                                url: `${inputPath}`
                            });
                            resizedDatas.push({
                                category: "video",
                                url: `${thumbVidUrl}`
                            });
                        }catch(err){
                            console.log('ffmpeg vid error : ', err);
                            throw err;
                        }
                        
                    }
                    //console.log('originDatas : ', originDatas);
                    //console.log('resizedData : ', resizedDatas);
                });
                setTimeout(async function(){
                    const result = await productModel.register({
                        siteUrl: siteUrl,
                        dataUrl: originDatas,
                        resizedDataUrl: resizedDatas,
                        writer: writer,
                        description: content,
                        plural: pluralTF,
                        userIdx: _id
                    });
                    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.REGISTER_SUCCESS_INSTA, result));
                }, 6000);
            }
        }catch(err){
            console.log('instagramCrawler error : ', err);
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.DB_ERROR));
        }
    }
}