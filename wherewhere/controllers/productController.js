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
    //홈 카테고리
    showAllById: async(req, res)=>{
        const _id = req.decoded._id;
        try{
            const result = await productModel.showAllById(_id).exec();
            //console.log('result : ', result);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_ALL_BY_ID, result));
        }catch(err){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.SERVER_ERROR));
        }
    },
    //메인 카테고리
    showByMainCategory: async(req, res)=>{
        const _id = req.decoded._id;
        const mainCategoryIdx = req.params.mainCategoryIdx;
        try{
            const result = await productModel.showByMainCategory(_id, mainCategoryIdx).exec();
            //console.log('result : ', result);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_BY_MAIN, result));
        }catch(err){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.SERVER_ERROR));
        }
    },
    //서브 카테고리
    showBySubCategory: async(req, res)=>{
        const _id = req.decoded._id;
        const subCategoryIdx = req.params.subCategoryIdx;
        try{
            const result = await productModel.showProductsBySubCategory(_id, subCategoryIdx).exec();
            //console.log('result : ', result);
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_BY_SUB, result));
        }catch(err){
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.SERVER_ERROR));
        }
    },
    showDetail: async(req, res)=>{
        const _id = req.decoded._id;
        const productIdx = req.body.productIdx;
        try{
            const result = await productModel.showOneProductDetail(_id, productIdx).exec();
            //userActionSchema 만들어야 할 듯
            return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.SHOW_ONE_DETAIL, result));
        }catch(err){
            console.log('err : ', err);
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.SERVER_ERROR));
        }
    },
    deleteProduct: async(req, res)=>{
        const _id = req.decoded._id;
        const productIdx = req.body.productIdx;
        try{
            const detail = await productModel.showOneProductDetail(_id, productIdx);
            if(detail[0]["like"]===false){
                const payload = {
                    like: true
                };
                const result = await productModel.deleteOneProduct(productIdx, payload);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_PRODUCT, result));
            }else{
                const payload = {
                    like: false
                };
                const result = await productModel.deleteOneProduct(productIdx, payload);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_PRODUCT, result));
            }
            //return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_PRODUCT, result));
        }catch(err){
            console.log('err : ', err);
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.SERVER_ERROR));
        }
    },
    heartClick: async(req, res)=>{
        const _id = req.decoded._id;
        const productIdx = req.body.productIdx;
        try{
            const detail = await productModel.showOneProductDetail(_id, productIdx);
            if(detail[0]["importance"]==0){
                const payload = {
                    importance: 1
                };
                const result = await productModel.heartClicked(productIdx, payload);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.HEART_CLICK_ON, result));
            }else{
                const payload = {
                    importance: 0
                };
                const result = await productModel.heartClicked(productIdx, payload);
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.HEART_CLICK_OFF, result));
            }
        }catch(err){
            console.log('err : ', err);
            return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.SERVER_ERROR));
        }
    },
    heartFilter: async(req, res)=>{
        const _id = req.decoded._id;
        /**
         * 클라에서 sorting해주는 게 더 낫지 않을까?
         */
    },
    facebookRegister: async (req, res)=>{
        const _id = req.decoded._id;
        const capturedImg = req.file.location;
        const siteUrl = req.body.siteUrl;
        try{
            const result = await facebookCrawler.crawl(siteUrl);
            const {writer, content, datas} = result;
            const returnImages = [];
            const resizedImages = [];
            const originImages = [];
            // facebook은 비디오를 가져올 수 없다.
            var cnt=0;
            var pluralTF = false;
            const imageName = randomString.generate(15);
            if(datas.length==0){//🛑사진이 없는 게시글 -> 캡처 이미지
                request({
                    method: 'POST',
                    url: "https://zywu2rb1mb.execute-api.ap-northeast-2.amazonaws.com/v1/trigger",
                    json: {
                        "bucket": "wherewhere-bucket",
                        "key": `images/${capturedImg.split('images/')[1]}`
                    },
                }, function(error, response, body){
                    if(error){
                        throw error;
                    }else{
                        var filename = capturedImg.split('original/')[1];
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
            }else{//🛑사진이 있으면 크롤링한 사진으로
                try{
                    datas.forEach(async (element)=>{
                        cnt+=1;
                        if(cnt>=2){
                            pluralTF = true;
                        }
                        const returnImg = await downloadModule.download(element["image"], imageName, cnt);
                        returnImages.push({
                            image: returnImg['location']
                        });
                        request({
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
                }catch(err){
                    console.log('request model facebook error 1 : ', err);
                    return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.SERVER_ERROR));
                }
            }
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
            }, 4000);
        }catch(err){
            //🛑capturedImg 로 product 생성
            console.log("페북 크롤링 에러 혹은 비공개 게시글");
            try{
                const resizedImages = [];
                const originImages = [];
                request({
                    method: 'POST',
                    url: "https://zywu2rb1mb.execute-api.ap-northeast-2.amazonaws.com/v1/trigger",
                    json: {
                        "bucket": "wherewhere-bucket",
                        "key": `images/${capturedImg.split('images/')[1]}`
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
                const result = await productModel.register({
                    siteUrl: siteUrl,
                    dataUrl: originImages,
                    resizedDataUrl: resizedImages,
                    writer: "비공개",
                    description: "비공개",
                    plural: false,
                    userIdx: _id
                });
                return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.REGISTER_SUCCESS_FB, result));
            }catch(err){
                console.log('request model facebook error 2 : ', err);
                return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.SERVER_ERROR));
            }
        }
    },
    instagramRegister: async(req, res)=>{
        const _id = req.decoded._id;
        //const { siteUrl, capturedImg } = req.body;
        const capturedImg = req.file.location;//리턴받은 url
        const siteUrl = req.body.siteUrl;
        try{
            const result = await instagramCrawler.crawler(siteUrl);
            if(result === "비공개 계정"){//비공개 계정 -> 캡처한 사진 저장
                console.log("비공개 계정, siteUrl만 저장한다.");
                request({
                    method: 'POST',
                    url: "https://zywu2rb1mb.execute-api.ap-northeast-2.amazonaws.com/v1/trigger",
                    json: {
                        "bucket": "wherewhere-bucket",
                        "key": `images/${capturedImg.split('images/')[1]}`
                    },
                }, async function(error, response, body){
                    if(error){
                        throw error;
                    }else{
                        var filename = capturedImg.split('original/')[1];
                        const resizedDatas = [{
                            category: "image",
                            url: `https://wherewhere-bucket.s3.ap-northeast-2.amazonaws.com/images/resized/${filename}`
                        }];
                        const originDatas = [{
                            category: "image",
                            url: `https://wherewhere-bucket.s3.ap-northeast-2.amazonaws.com/images/complete/${filename}`
                        }];
                        const result = await productModel.register({
                            siteUrl: siteUrl,
                            dataUrl: originDatas,
                            resizedDataUrl: resizedDatas,
                            writer: "비공개",
                            description: "비공개",
                            plural: false,
                            userIdx: _id
                        });
                        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.REGISTER_SUCCESS_INSTA, result));
                    }
                });
            }else{//크롤링한 자료로 저장
                const {
                    writer,
                    content,
                    datas
                } = result;
                //console.log('writer, content, datas : ', writer, content, datas);
                const originDatas = {};
                const resizedDatas = {};
                const newFileName = randomString.generate(17);
                var cnt = 0;
                var pluralTF = false;
                console.log(writer, content, datas);
                datas.forEach(async (element)=>{
                    cnt+=1;
                    if(cnt>=2){
                        pluralTF = true;
                    }
                    if(element["category"]=="image"){//사진 저장
                        const returnImg = await downloadModule.download(element["url"], newFileName, cnt);
                        //console.log('returnImg : ', returnImg);
                        request({
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
                                resizedDatas[filename] = {
                                    category: "image",
                                    url: `https://wherewhere-bucket.s3.ap-northeast-2.amazonaws.com/images/resized/${filename}`
                                };
                                originDatas[filename] = {
                                    category: "image",
                                    url: `https://wherewhere-bucket.s3.ap-northeast-2.amazonaws.com/images/complete/${filename}`
                                };
                            }
                        });
                    }else{//비디오 저장
                        try{
                            const returnVid = await downloadModuleVid.download(element["url"], newFileName, cnt);
                            //console.log('returnVid : ', returnVid);
                            const inputPath = returnVid["location"];//original vid url
                            const filename = inputPath.split('original/')[1];
                            const ffmpegResult = await ffmpegController.createPreviewVideo(inputPath);
                            //console.log('ffmpegResult : ', ffmpegResult);
                            const thumbVidUrl = ffmpegResult["Location"];
                            resizedDatas[filename] = {
                                category: "video",
                                url: `${thumbVidUrl}`
                            };
                            originDatas[filename] = {
                                category: "video",
                                url: `${inputPath}`
                            };
                            /*
                            originDatas.push({
                                category: "video",
                                url: `${inputPath}`
                            });
                            resizedDatas.push({
                                category: "video",
                                url: `${thumbVidUrl}`
                            });
                            */
                        }catch(err){
                            console.log('ffmpeg vid error : ', err);
                            throw err;
                        }
                        
                    }
                    //console.log('originDatas : ', originDatas);
                    //console.log('resizedData : ', resizedDatas);
                });
                setTimeout(async function(){
                    const originDataOrdered = [];
                    const resizedDataOrdered = [];
                    const func = function(originDatas, resizedDatas, callback){
                        //const originDataOrdered = [];
                        const originKeys = Object.keys(originDatas).sort();
                        originKeys.forEach((key)=>{
                            originDataOrdered.push(originDatas[key])
                        });
                        //const resizedDataOrdered = [];
                        const resizedKeys = Object.keys(resizedDatas).sort();
                        resizedKeys.forEach((key)=>{
                        resizedDataOrdered.push(resizedDatas[key])
                        });
                        callback()
                    }
                    func(originDatas, resizedDatas, async function(){
                        console.log('originDataOrderd : ', originDataOrdered);
                        console.log('resizedDataOrdered : ', resizedDataOrdered);
                        const result = await productModel.register({
                            siteUrl: siteUrl,
                            dataUrl: originDataOrdered,
                            resizedDataUrl: resizedDataOrdered,
                            writer: writer,
                            description: content,
                            plural: pluralTF,
                            userIdx: _id
                        });
                        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.REGISTER_SUCCESS_INSTA, result));
                    })
                    /*
                    const originDataOrdered = [];
                    const originKeys = Object.keys(originDatas).sort();
                    originKeys.forEach((key)=>{
                        originDataOrdered.push(originDatas[key])
                    });
                    const resizedDataOrdered = [];
                    const resizedKeys = Object.keys(resizedDatas).sort();
                    resizedKeys.forEach((key)=>{
                        resizedDataOrdered.push(resizedDatas[key])
                    });
                    
                    const result = await productModel.register({
                        siteUrl: siteUrl,
                        dataUrl: originDataOrdered,
                        resizedDataUrl: resizedDataOrdered,
                        writer: writer,
                        description: content,
                        plural: pluralTF,
                        userIdx: _id
                    });
                    return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.REGISTER_SUCCESS_INSTA, result));
                    */
                    
                }, 4000);
            }
        }catch(err){
            console.log("인스타그램 크롤링 혹은 사진 저장 중 에러 발생, 캡처한 사진으로 저장한다.");
            try{
                request({
                    method: 'POST',
                    url: "https://zywu2rb1mb.execute-api.ap-northeast-2.amazonaws.com/v1/trigger",
                    json: {
                        "bucket": "wherewhere-bucket",
                        "key": `images/${capturedImg.split('images/')[1]}`
                    },
                }, async function(error, response, body){
                    if(error){
                        throw error;
                    }else{
                        var filename = capturedImg.split('original/')[1];
                        const resizedDatas = [{
                            category: "image",
                            url: `https://wherewhere-bucket.s3.ap-northeast-2.amazonaws.com/images/resized/${filename}`
                        }];
                        const originDatas = [{
                            category: "image",
                            url: `https://wherewhere-bucket.s3.ap-northeast-2.amazonaws.com/images/complete/${filename}`
                        }];
                        const result = await productModel.register({
                            siteUrl: siteUrl,
                            dataUrl: originDatas,
                            resizedDataUrl: resizedDatas,
                            writer: "비공개",
                            description: "비공개",
                            plural: false,
                            userIdx: _id
                        });
                        return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.REGISTER_SUCCESS_INSTA, result));
                    }
                });
            }catch(err){
                console.log('instagram register error : ', err);
                return res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.SERVER_ERROR));   
            }
        }
    }
}